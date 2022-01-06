import { Bot, BotOptions, createBot } from "mineflayer";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { loadAllMachineContext } from "./util";
import { pathfinder } from "mineflayer-pathfinder";
import customPVP from "@nxg-org/mineflayer-custom-pvp";
import { NestedStateMachine } from "mineflayer-statemachine";

let bot: Bot;
let stateMachine: NestedStateMachine;
let info: {behaviors: typeof HiveBehavior[], transitions: typeof HiveTransition[], stateMachines: typeof NestedStateMachine[]} = {behaviors: [], transitions: [], stateMachines: []};

process.on("message", async (message) => {
    const msg = message as HostToWorkerDataFormat;
    // console.log(msg)
    switch (msg.subject) {
        case "init":
            info = await loadAllMachineContext();
            break;

        case "createBot":
            if (msg.datatype === "botInfo") {
                bot = createBot(msg.data as BotOptions);
                bot.loadPlugin(pathfinder);
                bot.loadPlugin(customPVP);
                bot.once("spawn", () => {
                    process.send!({ subject: "botSpawned" } as WorkerToHostDataFormat);
                });
            } else {
                throw "we have a problem";
            }
            break;
        case "enterRoot":
            if (msg.datatype === "rootName") {
                const type = info.stateMachines.find(i => i.name === msg.data)
                console.log(type, info.stateMachines.map(i => i.name))
                stateMachine = new (type as any)(bot)
            }
    }
});
