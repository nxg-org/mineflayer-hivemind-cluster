import { Bot, BotOptions, createBot } from "mineflayer";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";
import { HiveBehavior } from "./HiveMindStates";
import { behaviors, behaviorsAsList } from "./behaviors";
import { pathfinder } from "mineflayer-pathfinder";
import customPVP from "@nxg-org/mineflayer-custom-pvp";

let bot: Bot;
let state: HiveBehavior;
let stateType: typeof HiveBehavior;
let waitingToBeStopped: { [name: string]: boolean } = {};
let transitionString: string;
let transition: Function;
//let behaviors: {[stateName: string]: typeof HiveBehavior};

async function eventuallyHalt(name: string) {
    while (waitingToBeStopped[name]) {
        await bot.waitForTicks(1);
        state.update?.();
        if (state.exitCase?.()) {
            process.send!({ subject: "stateEnded", body: { kind: "stateEndedInfo", data: name } } as WorkerToHostDataFormat);
        }
    }
}

process.on("message", async (message) => {
    const msg = message as HostToWorkerDataFormat;
    // console.log(msg)
    switch (msg.subject) {
        case "init":
            console.log(msg);
            console.log(behaviors);
            break;

        case "createBot":
            if (msg.body?.kind === "botInfo") {
                bot = createBot(msg.body.data as BotOptions);
                bot.loadPlugin(pathfinder);
                bot.loadPlugin(customPVP);
                bot.once("spawn", () => {
                    process.send!({ subject: "botSpawned" } as WorkerToHostDataFormat);
                });
            } else {
                throw "we have a problem";
            }
            break;
        case "enterState":
            if (msg.body?.kind === "stateInfo") {
                const found = behaviorsAsList.find((state) => state.name === msg.body!.data);
                if (!found) return;
                state = new found(bot);
                stateType = found;
                state.active = true;
                state.onStateEntered?.();
                if (stateType.autonomous) {
                    waitingToBeStopped[found.name] = true;
                    eventuallyHalt(found.name);
                }
            }
            break;
        case "exitState":
            if (!state.active) return;
            state.onStateExited?.();
            state.active = false;
            if (stateType.autonomous) {
                waitingToBeStopped[stateType.name] = false;
            }
            break;

        // case "evalTransition":
        //     if (msg.body?.kind === "transitionInfo") {
        //         if (transitionString !== (msg.body.data as any).function) {
        //             transitionString = (msg.body.data as any).function;
        //             transition = (msg.body.data as any).function;

        //             const res = await eval("function anon(){return (" + transitionString + ")(bot)};");
        //             process.send!({
        //                 subject: "transitionEvaluated",
        //                 body: {
        //                     kind: "transitionEvaluation",
        //                     data: {
        //                         parentName: (msg.body.data as any).parentName,
        //                         childName: (msg.body.data as any).childName,
        //                         result: res,
        //                     },
        //                 },
        //             } as WorkerToHostDataFormat);
        //         }
        //     }
        //     break;
        default:
            console.log("hi", msg);
            break;
    }
});
