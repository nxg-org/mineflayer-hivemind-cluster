import { Serializable } from "child_process";
import { HiveBehavior } from "./HiveMindStates";

export type HostToWorkerSubjects = "init" | "createBot" | "enterRoot";
export type HostToWorkerBodyTypes = "botInfo" | "rootName"

export type WorkerToHostSubjects = "botSpawned" | "stateEnded";
export type WorkerToHostBodyTypes = "stateEndedInfo" | "fuck";

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
