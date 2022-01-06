import EventEmitter from "events";
import { Bot } from "mineflayer";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { ChildProcess, Serializable } from "child_process";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";

export interface NestedHiveMindOptions {
    bot: Bot,
    stateName: string;
    transitions: typeof HiveTransition[];
    enter: typeof HiveBehavior;
    exit?: typeof HiveBehavior;
    autonomous: boolean;
    ignoreBusy: boolean;
}

export class NestedHiveMind extends EventEmitter implements HiveBehavior {
    readonly bot: Bot;
    readonly autonomous: boolean;
    readonly ignoreBusy: boolean;
    readonly stateName: string;
    readonly transitions: HiveTransition[];
    readonly states: HiveBehavior[];
    readonly enter: HiveBehavior;
    readonly exit?: HiveBehavior;
    readonly runningStates: { [behaviorName: string]: ChildProcess[] };
    activeState?: HiveBehavior;
    active: boolean;
    depth: number;

    constructor({
        bot,
        transitions,
        enter,
        exit,
        stateName = "nestedHiveMind",
        autonomous = false,
        ignoreBusy = false,
    }: NestedHiveMindOptions) {
        super();
        this.autonomous = autonomous;
        this.ignoreBusy = ignoreBusy;
        this.stateName = stateName;
        this.bot = bot;
        this.enter = new enter(bot);
        this.exit = exit ? new exit(bot): undefined;
        this.transitions = this.loadTransitions(transitions);
        this.states = this.findStates();
        this.runningStates = {};
        this.active = false;
        this.depth = 0;

    }

    private loadTransitions(transitions: typeof HiveTransition[]): HiveTransition[] {
        return transitions.map(t => new (t as any)(this.bot)) //LOL
    }

    private findStates(): HiveBehavior[] {
        const states = [];
        states.push(this.enter);

        if (this.exit != null) {
            if (!states.includes(this.exit)) {
                states.push(this.exit);
            }
        }

        for (let i = 0; i < this.transitions.length; i++) {
            const trans = this.transitions[i];

            if (!states.includes(trans.parentState)) {
                states.push(trans.parentState);
            }

            if (!states.includes(trans.childState)) {
                states.push(trans.childState);
            }
        }
        return states;
    }

    private setStatesInactive(stateType: typeof HiveBehavior): void {
        const processes = this.runningStates[stateType.name];
        processes.forEach((p) => p.send({ subject: "disableState" } as HostToWorkerDataFormat));
    }

    private enterStates(enterState: typeof HiveBehavior, ...processes: ChildProcess[]): void {
        processes.forEach((p) =>
            p.send({ subject: "enterState", body: { kind: "stateInfo", data: enterState.name } } as HostToWorkerDataFormat)
        ); //should I use stateName? dunno
        this.runningStates[enterState.name] = processes;
        this.emit("stateChanged");
    }

    private exitStates(exitState: typeof HiveBehavior): void {
        if (exitState.autonomous) return;
        const processes = this.runningStates[exitState.name];
        processes.forEach((p) => p.send({ subject: "exitState" } as HostToWorkerDataFormat)); //should I use stateName? dunno
        this.runningStates[exitState.name] = [];
        this.emit("stateChanged");
    }

    private stateEndedHandler = async (process: ChildProcess, msg: Serializable) => {
        const transition = this.transitions.find((t) => t.parentState.name === msg);
        if (!transition) throw "fuck";
        // console.log(this.activeStateType?.name, msg, transition.isTriggered());
        if (this.activeState?.name === msg && !transition.isTriggered()) return;
        const processes = this.runningStates[msg as string];
        if (!processes) throw "Invalid state.";
        const index = processes.indexOf(process);
        if (index > -1) this.runningStates[msg as string].splice(index, 1)[0].send({ subject: "exitState" } as HostToWorkerDataFormat);
    };

    // private async checkActiveTransition(transition: HiveTransition) {
    //     await Promise.all(this.processes.map(async (p) => await this.processTransition(p, transition)));
    // }

    public onStateEntered(): void {
        this.activeState = this.enter;
        this.state
    }

    public onStateExited(): void {
        if (this.activeState == null) return;
        this.exitStates(this.activeState);
        this.activeState = undefined;
    }

    public async update(): Promise<void> {
        for (let i = 0; i < this.transitions.length; i++) {
            const transition = this.transitions[i];
            if (transition.parentState === this.activeState) {
                // await this.checkActiveTransition(transition);
                if (transition.isTriggered() || transition.shouldTransition()) {
                    transition.resetTrigger();

                    if (transition.parentState.autonomous) {
                        transition.onTransition();
                        this.activeState = transition.childState;
                    } else {
                        this.setStatesInactive(transition.parentState);
                        this.exitStates(transition.parentState);
                        transition.onTransition();
                        const bots = this.getUsableBots();
                        this.activeState = transition.childState;
                        this.enterStates(this.activeState, ...bots);
                    }
                    return;
                }
            }
        }
    }

    /**
     * Checks whether or not this state machine layer has finished running.
     */
    public isFinished(): boolean {
        if (this.active == null) return true;
        if (this.exit == null) return false;

        return this.activeState === this.exit;
    }
}
