import { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { HiveBehavior, HiveSubbehavior } from "../HiveMindStates";
import { BehaviorSwordEntity } from "../subBehaviors";
import { MathUtils } from "@nxg-org/mineflayer-util-plugin";
const { yawPitchAndSpeedToDir, toRadians } = MathUtils;

export class CircleEntity extends HiveBehavior {
    private targetPos?: Vec3;

    constructor(...bots: Bot[]) {
        super(BehaviorSwordEntity, ...bots);

        for (const sub of this.subBehaviors) {
            sub.on("exitCaseMet", () => {
                this.handler(sub);
                this.emit("subBehaviorFinished", sub.bot)
            });
        }
    }

    onStateEntered = (context: any) => {
        if (!context.target?.position) {
            this.onStateExited();
            return;
        }

        this.targetPos = context.target.position;

        const angleOffset = 360 / this.bots.length;
        const offsets = [];
        for (let i = 0; i < this.subBehaviors.length; i++) {
            offsets.push(this.targetPos!.plus(yawPitchAndSpeedToDir(toRadians(angleOffset * i), 0, 3)));
        }

        for (let i = 0; i < this.subBehaviors.length; i++) {
            const sub = this.subBehaviors[i];
            sub.onStateEntered?.(offsets[i]);
        }
    };

    onStateExited = () => {
        return;
    };

    handler = (sub: HiveSubbehavior) => {
        const index = this.subBehaviors.indexOf(sub);
        if (index > -1) this.subBehaviors.splice(index, 1)[0].onStateExited?.();
    };
}
