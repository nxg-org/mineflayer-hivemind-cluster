import cpu from "os";
import { CentralHiveMind } from "./HiveMindCentral";
import { promisify } from "util";
import { Bot, createBot } from "mineflayer";
import { Entity } from "prismarine-entity";
import { createProcesses } from "./util";

const sleep = promisify(setTimeout);

const debug = true;

const controller = new AbortController();
const { signal } = controller;

const leader = createBot({ username: `test_gen0`, host: "localhost", version: "1.17.1" });

const processes = createProcesses("test_gen", 8, { signal });

let target: Entity | undefined;
leader.on("physicsTick", () => {
    target = leader.nearestEntity((e) => e.type === "player" && !e.username?.includes("test")) as any;
});

import RootStateMachine from "./hiveInfo/machines/root";

let centralMachine = new CentralHiveMind(processes, RootStateMachine as any);

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
