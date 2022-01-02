import {Bot, BotOptions, createBot} from "mineflayer"
import { HostToWorkerDataFormat } from "./types";
import { HiveBehavior } from "./HiveMindStates";
import {behaviors, behaviorsAsList} from "./behaviors"
import {pathfinder} from "mineflayer-pathfinder"


let bot: Bot;
let state: HiveBehavior;
//let behaviors: {[stateName: string]: typeof HiveBehavior};

process.on('message', async (message) => {
    const msg = message as HostToWorkerDataFormat;
    switch (msg.subject) {
        case "init":
            console.log(msg)
            console.log(behaviors);
            break;
        
        case "createBot":
            if (msg.body.kind === 'botInfo') {
                bot = createBot(msg.body.data as BotOptions)
                bot.loadPlugin(pathfinder)
                bot.once("spawn", () => {
                    bot.chat("I am alive!")
                    process.send!('bot_spawned', )
                })
            } else {
                throw "we have a problem"
            }
            break;
       case "switchState": 
            if (msg.body.kind === "stateInfo") {
                
                const found = behaviorsAsList.find(state => state.stateName === (msg.body.data as any).name)!
                state = new found(bot)
                // state = new (behaviors[msg.body.data.name as string]) (bot)
                state.onStateEntered?.();
            }
            break;

    }
  });
  
//   // Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
// process.send({ foo: 'bar', baz: NaN });