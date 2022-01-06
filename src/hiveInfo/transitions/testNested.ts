import { Bot } from "mineflayer";
import { BehaviorIdle, BehaviorSwordEntity } from "../behaviors";
import { HiveTransition } from "../../HiveMindStates";
import RootStateMachine from "../machines/root";

export class TransitionTestNested extends HiveTransition {
    readonly transitionName = "idleToRoot";

    
    constructor(bot: Bot) {
        super({ parent: BehaviorIdle, child: RootStateMachine, bot });
    }

    onTransition = () => {};

    shouldTransition = () => {
        return false;
    };
}

export default TransitionTestNested