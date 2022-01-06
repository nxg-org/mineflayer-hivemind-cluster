import { Bot } from "mineflayer";

export class HiveSubbehavior {
    /**
     * The name of this behavior state.
     */
    static substateName: string = "defaultName";
    static autonomous: boolean = false;
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
        this.bot = bot;
    }
}


export class HiveBehavior {
    static stateName: string = "defaultName";

    public bots: Bot[];

    constructor() {
        this.bots = [];
    }


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


}


/**
 * The parameters for initializing a state transition.
 */
export interface HiveTransitionParameters {
    parent: typeof HiveSubbehavior;
    child: typeof HiveSubbehavior;
    transitionName?: string;
    shouldTransition?: () => boolean;
    onTransition?: () => void;
}

/**
 * A transition that links when one state (the parent) should transition
 * to another state (the child).
 */
export class HiveTransition {
    readonly parentState: typeof HiveSubbehavior;
    readonly childState: typeof HiveSubbehavior;
    readonly shouldTransitionStringified: string
    private triggerState: boolean = false;
    shouldTransition: () => boolean;
    onTransition: () => void;
    transitionName?: string;

    constructor({ parent, child, transitionName: name, shouldTransition = () => false, onTransition = () => {} }: HiveTransitionParameters) {
        this.parentState = parent;
        this.childState = child;
        this.shouldTransitionStringified = shouldTransition.toString();
        this.shouldTransition = shouldTransition;
        this.onTransition = onTransition;
        this.transitionName = name;
    }

    trigger(): void {
        // I may need to re-implement this later.
        // if (!this.parentState.active) {
        //     return;
        // }

        this.triggerState = true;
    }

    isTriggered(): boolean {
        return this.triggerState;
    }

    resetTrigger(): void {
        this.triggerState = false;
    }
}
