import { Bot, BotOptions, createBot } from "mineflayer";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";
import { HiveBehavior } from "./HiveMindStates";
import { loadAllMachineContext } from "./util";
import { pathfinder } from "mineflayer-pathfinder";
import customPVP from "@nxg-org/mineflayer-custom-pvp";

let bot: Bot;
let ctx = {};
(async () => {
    ctx = await loadAllMachineContext()
})()

