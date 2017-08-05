import {Command} from "../Command";
import {AbstractCommandBuilder} from "../AbstractCommandBuilder";
import {Run} from "./Run";

export class GuestControl extends AbstractCommandBuilder {
    constructor(command: Command, vmname: string, ...options: string[]) {
        super(command, 'guestcontrol', `"${vmname}"`, ...options);
    }

    verbose(): GuestControl {
        return this.arg('--verbose') as GuestControl;
    }

    username(username: string): GuestControl {
        return this.args('--username', `"${username}"`) as GuestControl;
    }

    password(password: string): GuestControl {
        return this.args('--password', `"${password}"`) as GuestControl;
    }

    run(...options: string[]): Run {
        return new Run(this.command, ...options);
    }
}