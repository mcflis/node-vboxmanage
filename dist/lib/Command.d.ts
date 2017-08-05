export interface ExecError {
    code: number;
    error: Error;
}
export interface CommandOpts {
    args: string[];
    binaryPath: string;
}
export declare class Command {
    private _args;
    private _binaryPath;
    constructor(cmd: CommandOpts);
    readonly args: string[];
    readonly line: string;
    readonly binaryPath: string;
    execute(): Promise<{}>;
}
