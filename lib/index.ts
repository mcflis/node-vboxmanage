import {AbstractCommandBuilder} from "./AbstractCommandBuilder";
import {GuestControl} from "./guestcontrol/index";

export * from './Command';
export * from './guestcontrol';
export * from './AbstractCommandBuilder';

export default class VBoxManage extends AbstractCommandBuilder {

    constructor(...options: string[]) {
        super();
        this.args(...options);
    }

    version(): VBoxManage {
        return this.arg('--version') as VBoxManage;
    }

    nologo(): VBoxManage {
        return this.arg('--nologo') as VBoxManage;
    }

    guestControl(vmname: string, ...options: string[]): GuestControl {
        return new GuestControl(this.command, vmname, ...options);
    }
}
