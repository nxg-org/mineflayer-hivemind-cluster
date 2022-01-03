

import { HiveBehavior } from "../HiveMindStates"
import {BehaviorFollowEntity} from "./behaviorFollowEntity"
import {BehaviorIdle} from "./behaviorIdle"
import {BehaviorLookAtEntity} from "./behaviorLookAtEntity"
import { BehaviorBowEntity } from "./behaviorBowEntity"

export {BehaviorFollowEntity}
export {BehaviorIdle}
export {BehaviorLookAtEntity}
export {BehaviorBowEntity}

export const behaviorsAsList = [BehaviorFollowEntity, BehaviorIdle, BehaviorLookAtEntity, BehaviorBowEntity]
export const behaviors: {[behaviorName: string]: typeof HiveBehavior} = {}
for (const behavior of behaviorsAsList) {
    behaviors[behavior.name] = behavior

}
