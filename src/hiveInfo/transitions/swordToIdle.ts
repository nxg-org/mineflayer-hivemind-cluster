import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionSwordToIdle extends HiveTransition {
    readonly transitionName = "idleToSword";


    constructor(bot: Bot) {
        super({ parent: BehaviorSwordEntity, child: BehaviorIdle, bot});
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !this.bot.entity || this.bot.health == null
    };
}


export default TransitionSwordToIdle