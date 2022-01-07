import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionSwordToIdle extends HiveTransition {
    readonly transitionName = "bowToIdle";


    constructor(bot: Bot) {
        super({ parent: BehaviorSwordEntity, child: BehaviorIdle, bot});
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !this.bot.bowpvp.target
    };
}


export default TransitionSwordToIdle