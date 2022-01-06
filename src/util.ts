import path, { resolve } from "path";
import { promises } from "fs";
const { readdir } = promises;

async function* getFiles(dir: string): AsyncGenerator<string, void, unknown> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}

export async function loadAllMachineContext() {
    const behaviors = [];
    const transitions = [];
    const stateMachines = [];

    const machineFiles = getFiles(path.join(__dirname, "./hiveInfo"));

    for await (const file of machineFiles) {
        if (!file.endsWith(".js")) continue;
        const importee = (await import(file)).default;
        if (!importee) continue; 
        if (file.includes("/behaviors/")) {
            behaviors.push(importee)
        } else if (file.includes("/transitions/")) {
            transitions.push(importee)
        } else if (file.includes("/machines/")) {
            stateMachines.push(importee)
        }
    }

    return {behaviors, transitions, stateMachines}
}
