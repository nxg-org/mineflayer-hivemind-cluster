import EventEmitter from "events";
import { Bot } from "mineflayer";
import { NestedHiveMind } from "./HiveMindNested";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { ChildProcess } from "child_process";
import { promisify } from "util";
import { HostToWorkerDataFormat, WorkerToHostDataFormat } from "./types";
const sleep = promisify(setTimeout)

export class CentralHiveMind extends EventEmitter {
    readonly processes: ChildProcess[];

    readonly activeBots: ChildProcess[]; //{[hivemindName: string]: Bot[]}
    readonly droppedBots: ChildProcess[];

    readonly root: typeof NestedHiveMind;

    readonly transitions: HiveTransition[];
    readonly states: HiveBehavior[];
    readonly nestedHives: NestedHiveMind[];

    constructor(processes: ChildProcess[], root: typeof NestedHiveMind) {
        super();
        this.processes = processes;
        this.root = root;

        this.states = [];
        this.transitions = [];
        this.nestedHives = [];
        this.activeBots = [];
        this.droppedBots = [];
        this.initProcesses()
        // this.findStatesRecursive(this.root);
        // this.findTransitionsRecursive(this.root);
        // this.findNestedHiveMinds(this.root);

        //lazy right now. implementing later.
        // this.bots[0].on("physicsTick", () => this.update());

        // this.root.active = true;
        // this.root.onStateEntered();
    }


    private initProcesses(): void {
        this.processes.forEach(p => {
            p.on("message", (message) => {
                const msg = message as WorkerToHostDataFormat
                switch (msg.subject) {
                    case "botSpawned":
                        p.send!({subject: "enterRoot", datatype: "rootName", data: this.root.name} as HostToWorkerDataFormat)
                        break;

                }
            })
        })
    }


    private findNestedHiveMinds(nested: NestedHiveMind, depth: number = 0): void {
        this.nestedHives.push(nested);
        nested.depth = depth;

        nested.on("stateChanged", () => this.emit("stateChanged"));
        // nested.on("requestBots", this.provideBotsOnRequest)


        for (const state of nested.states) {
            if (state instanceof NestedHiveMind) {
                this.findNestedHiveMinds(state, depth + 1);
            }
        }
    }

    private findStatesRecursive(nested: NestedHiveMind): void {
        for (const state of nested.states) {
            this.states.push(state);

            if (state instanceof NestedHiveMind) {
                this.findStatesRecursive(state);
            }
        }
    }

    private findTransitionsRecursive(nested: NestedHiveMind): void {
        for (const trans of nested.transitions) {
            this.transitions.push(trans);
        }

        for (const state of nested.states) {
            if (state instanceof NestedHiveMind) {
                this.findTransitionsRecursive(state);
            }
        }
    }



    // private provideBotsOnRequest = (hivemind: typeof NestedHiveMind, amount: number, exclusive: boolean) => {
    //     for (let i = 0; i < amount; i++) {
    //         const process = this.processes[i]
    //         if (!process) return;
    //         //if (!exclusive) this.bots.push(bot)
    //     }
    // }
}
