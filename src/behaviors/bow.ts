import { Bot } from "mineflayer";
import { Entity } from "prismarine-entity";
import { HiveSubbehavior } from "../HiveMindStates";
import { goals, Movements } from "mineflayer-pathfinder";
import md from "minecraft-data";

/**
 * The bot will look at the target entity.
 */
export class BehaviorBowEntity extends HiveSubbehavior {
    static stateName: string = "bowEntity";
    movements?: Movements;
    active: boolean = false;
    target?: Entity;

    constructor(bot: Bot) {
        super(bot);
    }

    onStateEntered(): void {
        this.target = this.bot.nearestEntity((e) => e.type === "player" && !e.username?.includes("test")) ?? undefined;
        if (!this.target) return;
        const mcData = md(this.bot.version);
        this.movements = new Movements(this.bot, mcData);
        this.bot.bowpvp.attack(this.target);
        const pathfinder = this.bot.pathfinder;
        const goal = new goals.GoalFollow(this.target, 2);
        if (this.movements) pathfinder.setMovements(this.movements);
        pathfinder.setGoal(goal, true);
    }

    update(): void {
        this.target = this.bot.nearestEntity((e) => e.type === "player" && !e.username?.includes("test")) ?? undefined;
        if (!this.target) return;
        this.bot.bowpvp.attack(this.target);
        if (!this.bot.pathfinder.isMoving()) {
            const pathfinder = this.bot.pathfinder;
            const goal = new goals.GoalFollow(this.target, 2);
            pathfinder.setGoal(goal, true);
        }
    }

    onStateExited(): void {
        this.bot.bowpvp.stop()
        this.bot.pathfinder.stop()
    }

    /**
     * Gets the distance to the target entity.
     *
     * @returns The distance, or 0 if no target entity is assigned.
     */
    distanceToTarget(): number {
        const entity = this.target;
        if (entity == null) return 0;

        return this.bot.entity.position.distanceTo(entity.position);
    }
}
