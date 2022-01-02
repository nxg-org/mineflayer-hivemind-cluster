import { Serializable } from "child_process"
import { HiveBehavior } from "./HiveMindStates"


export type HostToWorkerSubjects = "init" | "createBot" | "switchState"
export type HostToWorkerBodyTypes = "allStatesInfo" | "botInfo" | "stateInfo"


export type StateInfoData = {
    name: string
}


export type WorkerToHostSubjects = "createWorker"
export type WorkerToHostBodyTypes = "fuck"






export type HostToWorkerDataFormat = {
    subject: HostToWorkerSubjects,
    body: {
        kind: HostToWorkerBodyTypes,
        data: Serializable
    }
}

export type WorkerToHostDataFormat = {
    subject: WorkerToHostSubjects,
    body: {
        kind: WorkerToHostBodyTypes,
        data: Serializable
    }

}
