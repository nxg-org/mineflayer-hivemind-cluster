import { Bot } from "mineflayer";
import { HiveBehavior } from "../../HiveMindStates";

/**
 * The bot will stand idle and do... nothing.
 */
export class BehaviorIdle extends HiveBehavior {
    stateName: string = "idle";

    constructor(bot: Bot) {
        super(bot);
    }
}

export default BehaviorIdle