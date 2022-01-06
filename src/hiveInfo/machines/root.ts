import { Bot } from "mineflayer";
import { NestedHiveMind } from "../../HiveMindNested";
import { HiveTransition } from "../../HiveMindStates";
import { BehaviorIdle } from "../behaviors";
import { TransitionIdleToSword, TransitionSwordToIdle } from "../transitions";


export class RootStateMachine extends NestedHiveMind {
    //static transitions: typeof HiveTransition[] = [TransitionIdleToSword, TransitionSwordToIdle]
  
    autonomous = true

    constructor(bot: Bot) {
        super({bot, enter: BehaviorIdle, stateName: "root", transitions: [TransitionIdleToSword, TransitionSwordToIdle] });
    }
}

export default RootStateMachine