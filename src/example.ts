import { ChildProcess, fork } from "child_process";
import path from "path";
import { HostToWorkerBodyTypes, HostToWorkerDataFormat } from "./types";
import cpu from "os";
import { CentralHiveMind } from "./HiveMindCentral";
import { HiveTransition } from "./HiveMindStates";
import { BehaviorBowEntity, BehaviorFollowEntity, BehaviorIdle, BehaviorLookAtEntity, BehaviorSwordEntity } from "./hiveInfo/behaviors";
import { NestedHiveMind } from "./HiveMindNested";
import { promisify } from "util";
import { createInterface } from "readline";
import { Bot, createBot } from "mineflayer";
import { Entity } from "prismarine-entity";

const sleep = promisify(setTimeout);

const debug = true;

const controller = new AbortController();
const processes: ChildProcess[] = [];
const { signal } = controller;

const leader = createBot({ username: `test_gen0`, host: "localhost", version: "1.17.1" });

for (let i = 1; i <= 8; i++) {
    const child = fork(path.join(__dirname, "botProcess.js"), { signal });
    processes.push(child);
    child.send({
        subject: "createBot",
        datatype: "botInfo",
        data: { username: `test_gen${i}`, host: "localhost", version: "1.17.1" },
    } as HostToWorkerDataFormat);
}

let rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

let target: Entity | undefined;
leader.on("physicsTick", () => {
    target = leader.nearestEntity((e) => e.type === "player" && !e.username?.includes("test")) as any;
});

import { loadAllMachineContext } from "./util";

(async () => {
    console.log(await loadAllMachineContext());
})();

// let childTransitions = [
//     new HiveTransition({
//         parent: BehaviorIdle,
//         child: BehaviorSwordEntity,
//         transitionName: "idleToSword",
//     }),

//     new HiveTransition({
//         parent: BehaviorSwordEntity,
//         child: BehaviorBowEntity,
//         transitionName: "swordToBow",
//     }),

//     new HiveTransition({
//         parent: BehaviorBowEntity,
//         child: BehaviorSwordEntity,
//         transitionName: "bowToSword",
//     }),

//     new HiveTransition({
//         parent: BehaviorBowEntity,
//         child: BehaviorIdle,
//         transitionName: "bowToIdle",
//     }),

//     new HiveTransition({
//         parent: BehaviorSwordEntity,
//         child: BehaviorIdle,
//         transitionName: "swordToIdle",
//     }),
// ];

// let childMachine = new NestedHiveMind({
//     processes,
//     transitions: childTransitions,
//     enter: BehaviorIdle,
//     exit: BehaviorIdle,
//     stateName: "childNested",
//     autonomous: false,
//     ignoreBusy: false,
// });

// let transitions = [
//     new HiveTransition({
//         parent: BehaviorIdle,
//         child: BehaviorFollowEntity,
//         transitionName: "idleToFollow",
//     }),
//     new HiveTransition({
//         parent: BehaviorFollowEntity,
//         child: BehaviorIdle,
//         transitionName: "followToIdle",
//     }),

//     new HiveTransition({
//         parent: BehaviorIdle,
//         child: BehaviorLookAtEntity,
//         transitionName: "idleToLook",
//     }),

//     new HiveTransition({
//         parent: BehaviorLookAtEntity,
//         child: BehaviorIdle,
//         transitionName: "lookToIdle",
//     }),

//     // new HiveTransition({
//     //     parent: BehaviorIdle,
//     //     child: childMachine
//     // })
// ];

// let test = new NestedHiveMind({
//     stateName: "root",
//     processes: processes,
//     autonomous: false,
//     ignoreBusy: false,
//     enter: BehaviorIdle,
//     transitions: transitions,
// });

// let hiveMind: CentralHiveMind;
// (async () => {
//     await sleep(3000);
//     hiveMind = new CentralHiveMind(processes, childMachine);
// })();

// // const webserver = new HiveMindWebserver(hiveMind);
// // webserver.startServer();

// leader.on("chat", (username, message: string) => {
//     const split = message.split(" ");
//     switch (split[0]) {
//         case "come":
//             hiveMind!.root.transitions[0].trigger();
//             break;
//         case "bow":
//             hiveMind!.root.transitions[1].trigger();
//             break;
//         case "look":
//             hiveMind!.root.transitions[2].trigger();
//             break;
//         case "lookstop":
//             hiveMind!.root.transitions[3].trigger();
//             break;
//         default:
//             hiveMind!.root.transitions.find((t) => t.transitionName === split[0])?.trigger();
//             break;
//     }
// });

// async function report() {
//     while (debug) {
//         if (hiveMind) {
//             console.log(hiveMind.root.activeState);
//             for (const key of Object.keys(hiveMind.root.runningStates)) {
//                 console.log(key, hiveMind.root.runningStates[key].length);
//             }
//             console.log(hiveMind.activeBots.length);
//         }

//         await sleep(1000);
//     }
// }

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
