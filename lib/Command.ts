import {spawn} from 'child_process';

export interface ExecError {
    code: number;
    error: Error;
}

export interface CommandOpts {
    args: string[];
    binaryPath: string;
}

export class Command {
    private _args: string[];
    private _binaryPath: string;

    constructor(cmd: CommandOpts) {
        this._args = cmd.args;
        this._binaryPath = cmd.binaryPath;
    }

    get args(): string[] {
        return this._args;
    }

    get line(): string {
        return [this._binaryPath].concat(this._args).join(' ').trim();
    }

    get binaryPath(): string {
        return this._binaryPath;
    }

    execute() {
        return new Promise((resolve, reject) => {
            let output = '';
            let child = spawn(this._binaryPath, this._args);


            child.stdout.on('data', data => {
                output += data.toString();
            });

            child.stderr.on('data', data => {
                output += data.toString();
            });

            child.on('close', () => {
                resolve(output);
            });

            child.on('exit', code => {
                if (code !== 0) {
                    reject({code: code, error: new Error(output)} as ExecError);
                }
            });
        });
    }
}
