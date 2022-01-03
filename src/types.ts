import { Serializable } from "child_process"
import { HiveBehavior } from "./HiveMindStates"


export type HostToWorkerSubjects = "init" | "createBot" | "enterState" | "exitState" | "disableState"
export type HostToWorkerBodyTypes = "allStatesInfo" | "botInfo" | "stateInfo"


export type StateInfoData = {
    name: string
}


export type WorkerToHostSubjects = "botSpawned" | "stateEnded" | "createWorker"
export type WorkerToHostBodyTypes = "stateEndedInfo" | "fuck"






export type HostToWorkerDataFormat = {
    subject: HostToWorkerSubjects,
    body?: {
        kind: HostToWorkerBodyTypes,
        data: Serializable
    }
}

export type WorkerToHostDataFormat = {
    subject: WorkerToHostSubjects,
    body?: {
        kind: WorkerToHostBodyTypes,
        data: Serializable
    }

}
