import { Bot } from "mineflayer";
import { BehaviorBowEntity, BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionBowToSword extends HiveTransition {
    readonly transitionName = "bowToSword";

    
    constructor(bot: any) {
        super({ parent: BehaviorBowEntity, child: BehaviorSwordEntity, bot });
    }

    onTransition = () => {};

    shouldTransition = () => {
        return this.bot.bowpvp.target!.position.distanceTo(this.bot.entity.position) <= 5;
    };
}


export default TransitionBowToSword;