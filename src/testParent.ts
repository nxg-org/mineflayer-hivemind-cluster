import { fork } from "child_process";
import path from "path";
import { HostToWorkerBodyTypes, HostToWorkerDataFormat } from "./types";
import cpu from "os";

const controller = new AbortController();
const { signal } = controller;
for (let i = 0; i < cpu.cpus().length - 2; i++) {
    const child = fork(path.join(path.dirname(__filename), "testChild.js"), { signal });

    child.send({
        subject: "createBot",
        body: { kind: "botInfo" as HostToWorkerBodyTypes, data: { username: `test${i}`, host: "localhost", version: "1.17.1" } },
    } as HostToWorkerDataFormat);
    child.on("message", (data) => {
        console.log(data)
        console.log("sent?")
        child.send({ subject: "switchState", body: { kind: "stateInfo", data: { name: "followEntity" } } } as HostToWorkerDataFormat);
    });

    // controller.abort();

    child.on("exit", (code, signals) => {
        console.log(code, signals);
    });
}
