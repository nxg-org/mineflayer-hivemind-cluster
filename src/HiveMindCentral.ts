import EventEmitter from "events";
import { Bot } from "mineflayer";
import { NestedHiveMind } from "./HiveMindNested";
import { HiveBehavior, HiveTransition } from "./HiveMindStates";
import { ChildProcess } from "child_process";
import { promisify } from "util";
const sleep = promisify(setTimeout)

export class CentralHiveMind extends EventEmitter {
    readonly bots: ChildProcess[];

    readonly activeBots: ChildProcess[]; //{[hivemindName: string]: Bot[]}
    readonly droppedBots: ChildProcess[];

    readonly root: NestedHiveMind;

    readonly transitions: HiveTransition[];
    readonly states: typeof HiveBehavior[];
    readonly nestedHives: NestedHiveMind[];

    constructor(bots: ChildProcess[], root: NestedHiveMind) {
        super();
        this.bots = bots;
        this.root = root;

        this.states = [];
        this.transitions = [];
        this.nestedHives = [];
        this.activeBots = [];
        this.droppedBots = [];
        this.findStatesRecursive(this.root);
        this.findTransitionsRecursive(this.root);
        this.findNestedHiveMinds(this.root);

        //lazy right now. implementing later.
        // this.bots[0].on("physicsTick", () => this.update());

        this.lazyHandler()

        this.root.active = true;
        this.root.onStateEntered();
    }


    private findNestedHiveMinds(nested: NestedHiveMind, depth: number = 0): void {
        this.nestedHives.push(nested);
        nested.depth = depth;

        nested.on("stateChanged", () => this.emit("stateChanged"));
        nested.on("requestBots", this.provideBotsOnRequest)


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


    private async lazyHandler() {
        while (true) {
            this.update()
            await sleep(50)

        }
    }

    /**
     * Called each tick to update the root state machine.
     */
    private update(): void {
        this.root.update();
    }


    private provideBotsOnRequest = (hivemind: NestedHiveMind, amount: number, exclusive: boolean) => {
        for (let i = 0; i < amount; i++) {
            const bot = this.bots[i]
            if (!bot) return;
            //if (!exclusive) this.bots.push(bot)
        }
    }
}
