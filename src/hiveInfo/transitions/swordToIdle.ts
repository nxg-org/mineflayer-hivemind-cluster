import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionSwordToIdle extends HiveTransition {
    readonly transitionName = "swordToIdle";


    constructor(bot: Bot) {
        super({ parent: BehaviorSwordEntity, child: BehaviorIdle, bot});
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !this.bot.swordpvp.target
    };
}


export default TransitionSwordToIdle