import { fork } from "child_process";
import path from "path";
import { HostToWorkerBodyTypes, HostToWorkerDataFormat } from "./types";
import cpu from "os";
import { CentralHiveMind } from "./HiveMindCentral";
import { HiveTransition } from "./HiveMindStates";
import {BehaviorBowEntity, BehaviorFollowEntity, BehaviorIdle, BehaviorLookAtEntity} from "./behaviors"
import { NestedHiveMind } from "./HiveMindNested";
import { promisify } from "util";
import { createInterface } from "readline";
import { createBot } from "mineflayer";

const sleep = promisify(setTimeout)

const debug = true;

const controller = new AbortController();
const processes = [];
const { signal } = controller;

const leader = createBot({ username: `test_gen0`, host: "localhost", version: "1.17.1" })



for (let i = 1; i <= cpu.cpus().length - 4; i++) {
    const child = fork(path.join(path.dirname(__filename), "botProcess.js"), { signal });
    processes.push(child);
    child.send({
        subject: "createBot",
        body: { kind: "botInfo" as HostToWorkerBodyTypes, data: { username: `test_gen${i}`, host: "localhost", version: "1.17.1" } },
    } as HostToWorkerDataFormat);
}

let rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});



let transitions = [
    new HiveTransition({
        parent: BehaviorIdle,
        child: BehaviorFollowEntity,
        name: "idleToFollow",
    }),
    new HiveTransition({
        parent: BehaviorFollowEntity,
        child: BehaviorIdle,
        name: "followToIdle",
    }),

    new HiveTransition({
        parent: BehaviorIdle,
        child: BehaviorLookAtEntity,
        name: "idleToLook",
    }),

    new HiveTransition({
        parent: BehaviorLookAtEntity,
        child: BehaviorIdle,
        name: "lookToIdle",
    }),
];

let test = new NestedHiveMind({
    stateName: "root",
    processes: processes,
    autonomous: false,
    ignoreBusy: false,
    enter: BehaviorIdle,
    transitions: transitions,
});


console.log(processes.length)
const hiveMind = new CentralHiveMind(processes, test)
// const webserver = new HiveMindWebserver(hiveMind);
// webserver.startServer();



leader.on("chat", (username, message: string) => {
    const split = message.split(" ");
    switch (split[0]) {
        case "come":
            hiveMind!.root.transitions[0].trigger();
            break;
        case "movestop":
            hiveMind!.root.transitions[1].trigger();
            break;
        case "look":
            hiveMind!.root.transitions[2].trigger();
            break;
        case "lookstop":
            hiveMind!.root.transitions[3].trigger();
            break;
    }
});

async function report() {
    while (debug) {
        if (hiveMind) {
            console.log(hiveMind.root.activeStateType);
            for (const key of Object.keys(hiveMind.root.runningStates)) {
                console.log(key, hiveMind.root.runningStates[key].length);
            }
            console.log(hiveMind.activeBots.length)
        }

        await sleep(1000);
    }
}

// report();



// child.send({
//     subject: "createBot",
//     body: { kind: "botInfo" as HostToWorkerBodyTypes, data: { username: `test_gen${i}`, host: "localhost", version: "1.17.1" } },
// } as HostToWorkerDataFormat);
// child.on("message", (data) => {
//     child.send({ subject: "enterState", body: { kind: "stateInfo", data: { name: "bowEntity" } } } as HostToWorkerDataFormat);
// });
// // controller.abort();

// child.on("exit", (code, signals) => {
//     console.log(code, signals);
// });
