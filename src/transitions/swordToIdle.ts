import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../HiveMindStates";

export class TransitionIdleToSword extends HiveTransition {
    static readonly transitionName = "idleToSword";
    public bot: Bot;

    constructor(bot: Bot) {
        super({ parent: BehaviorSwordEntity, child: BehaviorIdle });
        this.bot = bot;
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !this.bot.entity || this.bot.health == null
    };
}
