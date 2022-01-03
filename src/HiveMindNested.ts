import EventEmitter from "events";
import { Bot } from "mineflayer";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { ChildProcess, Serializable } from "child_process";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";

export interface NestedHiveMindOptions {
    stateName: string;
    processes: ChildProcess[];
    transitions: HiveTransition[];
    enter: typeof HiveBehavior;
    exit?: typeof HiveBehavior;
    autonomous: boolean;
    ignoreBusy: boolean;
}

export class NestedHiveMind extends EventEmitter implements NestedHiveMindOptions {
    readonly autonomous: boolean;
    readonly ignoreBusy: boolean;
    readonly stateName: string;
    readonly processes: ChildProcess[];
    readonly transitions: HiveTransition[];
    readonly states: typeof HiveBehavior[];
    readonly enter: typeof HiveBehavior;
    readonly exit?: typeof HiveBehavior;
    readonly runningStates: { [behaviorName: string]: ChildProcess[] };
    activeStateType?: typeof HiveBehavior;
    active: boolean
    depth: number;

    constructor({ processes, transitions, enter, exit, stateName = "nestedHiveMind", autonomous = false, ignoreBusy = false }: NestedHiveMindOptions) {
        super();
        this.autonomous = autonomous;
        this.ignoreBusy = ignoreBusy;
        this.stateName = stateName;
        this.processes = processes;
        this.enter = enter;
        this.exit = exit;
        this.transitions = transitions;
        this.states = this.findStates();
        this.runningStates = {};
        this.active = false;
        this.depth = 0;
        
        this.processes.forEach((p) => {
            p.on("message", (data) => {
                const msg = data as WorkerToHostDataFormat;
                switch (msg.subject) {
                    case "botSpawned":
                        break;
                    case "createWorker":
                        break;
                    case "stateEnded":
                        if (msg.body?.kind === "stateEndedInfo") this.stateEndedHandler(p, msg.body.data);
                        break;
                    default:
                        throw "Invalid subject.";
                }
            });
        });
    }

    private findStates(): typeof HiveBehavior[] {
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

    private getUsableBots(): ChildProcess[] {
        const usable = [];
        let fuck = 0
        for (const process of this.processes) {
            for (const state in this.runningStates) {
                if (this.activeStateType?.stateName === state || this.runningStates[state].includes(process)) {
                    fuck++
                    break;
                };
            }
            if (fuck === 0) usable.push(process);
            fuck = 0;
        }
        return this.processes;
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

    private stateEndedHandler = (process: ChildProcess, msg: Serializable) => {
        const transition = this.transitions.find(t => t.parentState === this.activeStateType)
        if (!transition) throw "fuck"
        if (this.activeStateType?.name === msg && (!transition.isTriggered() && !transition.shouldTransition())) return;
        const processes = this.runningStates[msg as string]
        if (!processes) throw "Invalid state."
        const index = processes.indexOf(process)
        if (index > -1) this.runningStates[msg as string].splice(index, 1)
        process.send({ subject: "exitState" } as HostToWorkerDataFormat)

    };

    public onStateEntered(): void {
        this.activeStateType = this.enter;
        const bots = this.getUsableBots();
        this.enterStates(this.activeStateType, ...bots);
    }

    public onStateExited(): void {
        if (this.activeStateType == null) return;
        this.exitStates(this.activeStateType);
        this.activeStateType = undefined;
    }

    public update(): void {
        for (let i = 0; i < this.transitions.length; i++) {
            const transition = this.transitions[i];
            if (transition.parentState === this.activeStateType) {
                if (transition.isTriggered() || transition.shouldTransition()) {
                    transition.resetTrigger();
                   
                    if (transition.parentState.autonomous) {
                        transition.onTransition();
                        this.activeStateType = transition.childState;
                    } else {
                        this.setStatesInactive(transition.parentState);
                        this.exitStates(transition.parentState);
                        transition.onTransition();
                        const bots = this.getUsableBots();
                        this.activeStateType = transition.childState;
                        this.enterStates(this.activeStateType, ...bots);
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

        return this.activeStateType === this.exit;
    }


}
