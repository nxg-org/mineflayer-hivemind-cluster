

import { HiveBehavior } from "../HiveMindStates"
import {BehaviorFollowEntity} from "./behaviorFollowEntity"
import {BehaviorIdle} from "./behaviorIdle"
import {BehaviorLookAtEntity} from "./behaviorLookAtEntity"
import { BehaviorBowEntity } from "./behaviorBowEntity"
import { BehaviorSwordEntity } from "./behaviorSwordEntity"

export {BehaviorFollowEntity}
export {BehaviorIdle}
export {BehaviorLookAtEntity}
export {BehaviorBowEntity}
export {BehaviorSwordEntity}

export const behaviorsAsList = [BehaviorFollowEntity, BehaviorIdle, BehaviorLookAtEntity, BehaviorBowEntity, BehaviorSwordEntity]
export const behaviors: {[behaviorName: string]: typeof HiveBehavior} = {}
for (const behavior of behaviorsAsList) {
    behaviors[behavior.name] = behavior

}
