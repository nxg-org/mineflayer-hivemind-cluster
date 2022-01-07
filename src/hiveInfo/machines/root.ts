import { Bot } from "mineflayer";
import { NestedHiveMind } from "../../HiveMindNested";
import { HiveTransition } from "../../HiveMindStates";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { TransitionIdleToSword, TransitionSwordToIdle } from "../transitions";
import TransitionBowToSword from "../transitions/bowToSword";
import { TransitionSwordToBow } from "../transitions/swordToBow";


export class RootStateMachine extends NestedHiveMind {
    //static transitions: typeof HiveTransition[] = [TransitionIdleToSword, TransitionSwordToIdle]
  
    autonomous = true

    constructor(bot: Bot) {
        super({bot, enter: BehaviorSwordEntity, stateName: "root", transitions: [TransitionIdleToSword, TransitionSwordToIdle, TransitionSwordToBow, TransitionBowToSword] });
    }
}

export default RootStateMachine