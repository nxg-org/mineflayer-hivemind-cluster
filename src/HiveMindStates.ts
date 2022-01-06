import { Bot } from "mineflayer";
import { EventEmitter } from "stream";

export class HiveBehavior extends EventEmitter {
    /**
     * The name of this behavior state.
     */
    stateName: string = "defaultName";
    autonomous: boolean = false;
    readonly bot: Bot;

    /**
     * Gets whether or not this state is currently active.
     */
    active: boolean = false;

    /**
     * Called when the bot enters this behavior state.
     */
    onStateEntered?(): void {}

    /**
     * Called each tick to update this behavior.
     */
    update?(): void {}

    /**
     * Called when the bot leaves this behavior state.
     */
    onStateExited?(): void {}

    /**
     * Called if the behavior is anonymous per tick, checks if task is complete.
     */
    exitCase?(): boolean {
        return false;
    }

    constructor(bot: Bot) {
        super();
        this.bot = bot;
    }
}


export class WIPBehavior extends EventEmitter {
    static stateName: string = "defaultName";

    public bots: Bot[];
    public subBehaviors: HiveBehavior[]
    public context: any;

    constructor(subBehavior: typeof HiveBehavior, ...bots: Bot[]) {
        super();
        this.bots = bots
        this.subBehaviors = this.bots.map(b => new subBehavior(b))
   
    }


    onStateEntered?(context: any): void {
        this.context = context
    }

    /**
     * Called each tick to update this behavior.
     */
    update?(): void {}

    /**
     * Called when the bot leaves this behavior state.
     */
    onStateExited?(): void {}

    /**
     * Called if the behavior is anonymous per tick, checks if task is complete.
     */
    exitCase?(): boolean {
        return false;
    }


}


/**
 * The parameters for initializing a state transition.
 */
export interface HiveTransitionParameters {
    parent: typeof HiveBehavior;
    child: typeof HiveBehavior;
    bot: Bot,
    transitionName?: string;
    shouldTransition?: () => boolean;
    onTransition?: () => void;
}

/**
 * A transition that links when one state (the parent) should transition
 * to another state (the child).
 */
export class HiveTransition {
    readonly parentState: HiveBehavior;
    readonly childState: HiveBehavior;
    readonly bot: Bot;
    private triggerState: boolean = false;
    shouldTransition: () => boolean;
    onTransition: () => void;
    transitionName?: string;

    constructor({ bot, parent, child, transitionName: name, shouldTransition = () => false, onTransition = () => {} }: HiveTransitionParameters) {
        this.parentState = new parent(bot);
        this.childState = new child(bot);
        this.bot = bot
        this.shouldTransition = shouldTransition;
        this.onTransition = onTransition;
        this.transitionName = name;
    }

    trigger(): void {
        // I may need to re-implement this later.
        if (!this.parentState.active) {
            return;
        }

        this.triggerState = true;
    }

    isTriggered(): boolean {
        return this.triggerState;
    }

    resetTrigger(): void {
        this.triggerState = false;
    }
}
