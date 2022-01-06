import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../HiveMindStates";

export class TransitionIdleToSword extends HiveTransition {
    static readonly transitionName = "idleToSword";
    public bot: Bot;

    constructor(bot: Bot) {
        super({ parent: BehaviorIdle, child: BehaviorSwordEntity });
        this.bot = bot;
    }

    onTransition = () => {};

    shouldTransition = () => {
        return false;
    };
}
