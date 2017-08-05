import {Command, CommandOpts} from "./Command";

export abstract class AbstractCommandBuilder {
    private _command: Command;

    constructor(command?: Command, ...options: string[]) {
        this._command = AbstractCommandBuilder.copy(command);
        this.args(...options);
    }

    static determineBinaryPath(): string {
        if (/^win/.test(process.platform)) {
            let vBoxInstallPath = process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH;
            return '"' + vBoxInstallPath + '\\VBoxManage.exe';

        } else {
            return 'vboxmanage';
        }
    }

    static copy(command?: Command): Command {
        return new Command({
            binaryPath: command && JSON.parse(JSON.stringify(command.binaryPath)) || AbstractCommandBuilder.determineBinaryPath(),
            args: command && command.args.map(a => a) || []
        } as CommandOpts);
    }

    get command(): Command {
        return this._command;
    }

    arg(arg: string): AbstractCommandBuilder {
        this._command.args.push(arg);
        return this;
    }

    args(...args: string[]): AbstractCommandBuilder {
        this._command.args.push.apply(this._command.args, args);
        return this;
    }

    build(): Command {
        return this._command;
    }
}