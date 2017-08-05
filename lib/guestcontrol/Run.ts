import {AbstractCommandBuilder} from "../AbstractCommandBuilder";
import {Command} from "../Command";

export class Run extends AbstractCommandBuilder {

    constructor(command: Command, ...options: string[]) {
        super(command, 'run', ...options);
    }

    program(program: string): Run {
        return this.args('--', `"${program}"`) as Run;
    }
}