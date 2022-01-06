import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../subBehaviors";
import { HiveTransition } from "../HiveMindStates";

export class TransitionIdleToSword extends HiveTransition {
    static readonly transitionName = "idleToSword";


    constructor(bot: Bot) {
        super({ parent: BehaviorSwordEntity, child: BehaviorIdle, bot});
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !this.bot.entity || this.bot.health == null
    };
}
