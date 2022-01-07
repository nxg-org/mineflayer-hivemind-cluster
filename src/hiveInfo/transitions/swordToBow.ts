import { Bot } from "mineflayer";
import { BehaviorBowEntity, BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionSwordToBow extends HiveTransition {
    readonly transitionName = "swordToBow";

    
    constructor(bot: any) {
        super({ parent: BehaviorSwordEntity, child: BehaviorBowEntity, bot });
    }

    onTransition = () => {};

    shouldTransition = () => {
        return this.bot.swordpvp.target!.position.distanceTo(this.bot.entity.position) > 5
    };
}


export default TransitionSwordToBow;