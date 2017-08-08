// Type definitions for mock-spawn v0.2.6
// Project: https://github.com/gotwarlost/mock-spawn
// Definitions by: Maximilian Flis <https://github.com/mcflis>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { ChildProcess, SpawnOptions } from "child_process";

export = mock_spawn;

interface Runner {
    (this:MockProcess, callback: (exitCode: number) => void): void;
}

interface RunnerObject {
    throws?: Error;
}

interface Signal {
    [signal: string]: boolean;
}

interface Strategy {
    (command: string, args?: string[], options?: SpawnOptions): Runner|boolean;
}

interface Sequence {
    add(runner: Runner|RunnerObject): void;
}

interface MockProcess extends ChildProcess {
    command: string;
    args: string;
    opts: SpawnOptions;
    exitCode: number;
    signal: string;
}

interface MockSpawn {
    (command: string, args?: string[], options?: SpawnOptions): MockProcess;
    simple(exitCode: number, stdout?: string, stderr?: string): Runner;
    setDefault(runner: Runner): void;
    setStrategy(strategy: Strategy): void;
    sequence: Sequence
    setSignals(signals: Signal): void;
    calls: MockProcess[];
}

declare function mock_spawn(verbose?: boolean): MockSpawn;

declare namespace mock_spawn {}
