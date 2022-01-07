import path, { resolve } from "path";
import { promises } from "fs";
import { ChildProcess, fork, ForkOptions } from "child_process";
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

export function createProcesses(name: string, number: number, signal?: ForkOptions): ChildProcess[] {
    const processes = []
    for (let i = 1; i <= number; i++) {
        const child = fork(path.join(__dirname, "botProcess.js"), signal);
        processes.push(child);
        child.send({
            subject: "init"
        })
        child.send({
            subject: "createBot",
            datatype: "botInfo",
            data: { username: `${name}${i}`, host: "localhost", version: "1.17.1" },
        });
    }

    return processes

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
