# Plan.


### Features:
- modular/optional control distance
- catch dropped control to main hive mind
- have nested functionality


### 9:53pm, Dec 30:
- my current setup does not allow for the modularity I inititally had.
- I will need to rewrite the HiveBehavior entirely again.
- Perhaps I should create a new Behavior class for each bot and then individually manage them all.
- I have the setup to do it, the autonomous functionality works (Check HiveMindNested).
- There is a lot to do, but I think I have a general concept down.
Hopefully all goes well.



### 3:23pm, Jan 1:
- How the fuck do I make shit multi-processed.
- No fucking clue.
- God, I hate this language.
- Also, fuck. There's two options here: I either completely rewrite this plugin to be compatible with mineflayer-pathfinder's absurd memory usage,
or I rewrite pathfinder to be abstracted away from the bot object itself. Both of which are terrible ideas.
- There is no point in me continuing to work on this in this shitty ass dogshit fucking garbage qrgwhpierb2egr language.
- If only pathfinder worked on multiple bots simultaneously. This single problem alone is what killed this project.
- I do not have the technical experience in JavaScript to rewrite pathfinder AND maintain it, making this project immediately or eventually obsolete.
- Lose-lose either way.


### 3:22am, Jan 3:
- Basic functionality is done for multi-processing. 
- However, there are multiple new challenges ahead.
- 1. I have to deal with the fact that NestedHiveMinds and HiveBehaviors are no longer interchangeable. 
- This means I have to take a step back and rewrite the functionality provided by the original mineflayer-statemachine.
- This may cause issues.
- 2. I believe I have to set up some sort of shared memory thing. However, this is multi-*processing*, not multi-*threading*, so I can't bullshit SharedArrayBuffer it.
- I think I will have to use sockets and communicate back to a central db. I have never written that before so this will be interesting.
- 3. My switching between states is **heavily** flawed. It needs updating, ASAP. This will be worked on after the 5th, when my assignments are in.
- Goodnight.