import { Bot } from "mineflayer";
import { HiveSubbehavior } from "../HiveMindStates";

/**
 * The bot will stand idle and do... nothing.
 */
export class BehaviorIdle extends HiveSubbehavior {
    static stateName: string = "idle";

    bots: Bot[] = [];

    constructor(bot: Bot) {
        super(bot);
    }
}
