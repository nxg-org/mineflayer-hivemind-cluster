import EventEmitter from "events";
import { Bot } from "mineflayer";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { ChildProcess, Serializable } from "child_process";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";

export interface NestedHiveMindOptions {
    bot: Bot,
    stateName: string;
    transitions: any[];
    enter: typeof HiveBehavior;
    exit?: typeof HiveBehavior;
    autonomous?: boolean;
    ignoreBusy?: boolean;
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

    // private async checkActiveTransition(transition: HiveTransition) {
    //     await Promise.all(this.processes.map(async (p) => await this.processTransition(p, transition)));
    // }

    public onStateEntered(): void {

        this.activeState = this.enter;
        this.activeState.active = true
        this.activeState.onStateEntered?.();
        this.bot.on("physicsTick", this.update)
        this.emit('stateChanged')
    }

    public onStateExited(): void {
        if (this.activeState == null) return;
        this.activeState.active = false
        this.activeState.onStateExited?.()
        this.activeState = undefined
        this.bot.removeListener("physicsTick", this.update)
    }

    public update = async () => {
        this.activeState?.update?.()

        for (let i = 0; i < this.transitions.length; i++) {
          const transition = this.transitions[i]
          if (transition.parentState.stateName === this.activeState?.stateName) {
            if (transition.isTriggered() || transition.shouldTransition()) {
              transition.resetTrigger()
              console.log("switch to", transition.childState.stateName)
    
              this.activeState.active = false
              this.activeState.onStateExited?.()
    
              transition.onTransition()
              this.activeState = transition.childState
              this.activeState.active = true
              this.emit('stateChanged')
    
              this.activeState.onStateEntered?.()
    
              return
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
