

import { HiveBehavior } from "../HiveMindStates"
import {BehaviorFollowEntity} from "./behaviorFollowEntity"
import {BehaviorIdle} from "./behaviorIdle"
import {BehaviorLookAtEntity} from "./behaviorLookAtEntity"

export {BehaviorFollowEntity}
export {BehaviorIdle}
export {BehaviorLookAtEntity}

export const behaviorsAsList = [BehaviorFollowEntity, BehaviorIdle, BehaviorLookAtEntity]
export const behaviors: {[behaviorName: string]: typeof HiveBehavior} = {}
for (const behavior of behaviorsAsList) {
    behaviors[behavior.name] = behavior

}
