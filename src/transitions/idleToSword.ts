import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../HiveMindStates";

export class TransitionIdleToSword extends HiveTransition {
    static readonly transitionName = "idleToSword";
    static parent = BehaviorIdle
    static child = BehaviorSwordEntity

    constructor(bot: Bot) {
        super({ parent: BehaviorIdle, child: BehaviorSwordEntity, bot });
    }

    onTransition = () => {};

    shouldTransition = () => {
        return false;
    };
}
