import { Serializable } from "child_process";
import { HiveBehavior } from "./HiveMindStates";

export type HostToWorkerSubjects = "init" | "createBot" | "enterState" | "exitState" | "disableState" | "evalTransition";
export type HostToWorkerBodyTypes = "allStatesInfo" | "botInfo" | "stateInfo" | "transitionInfo";

export type WorkerToHostSubjects = "botSpawned" | "stateEnded" | "createWorker" | "transitionEvaluated";
export type WorkerToHostBodyTypes = "stateEndedInfo" | "transitionEvaluation" | "fuck";

export type HostToWorkerDataFormat = {
    subject: HostToWorkerSubjects;
    datatype: HostToWorkerBodyTypes;
    data: Serializable;
};

export type WorkerToHostDataFormat = {
    subject: WorkerToHostSubjects;
    datatype: WorkerToHostBodyTypes;
    data: Serializable;
};
