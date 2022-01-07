import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";

export class TransitionIdleToSword extends HiveTransition {
    readonly transitionName = "idleToSword";

    
    constructor(bot: any) {
        super({ parent: BehaviorIdle, child: BehaviorSwordEntity, bot });
    }

    onTransition = () => {};

    shouldTransition = () => {
        return !!this.bot.nearestEntity(e => !e.username?.includes("test") && e.type === "player")
    };
}


export default TransitionIdleToSword;