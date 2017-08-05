import VBoxManage from "../lib/index";
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

const expect = chai.expect;

describe('VBoxManage', () => {
    before(() => {
        chai.should();
        chai.use(chaiAsPromised);
    });

    it('should support constructor options or option methods and both should return the same command line', () => {
        let line1 = new VBoxManage().nologo().version().build().line;
        let line2 = new VBoxManage('--nologo', '--version').build().line;
        expect(line1).to.equal(line2);
    });

    it('should determine the path to the vboxmanage executable', () => {
        let binaryPath = VBoxManage.determineBinaryPath().toLowerCase();
        if (/^win/.test(process.platform)) {
            expect(binaryPath).to.contain('vboxmanage.exe');
        } else {
            expect(binaryPath).to.contain('vboxmanage');
        }
    });

    describe('GuestControl', () => {
        it('should support constructor options or option methods and both should return the same command line', () => {
            let line1 = new VBoxManage().nologo().guestControl('the_vm').verbose().username('vagrant').password('vagrant').build().line;
            let line2 = new VBoxManage('--nologo').guestControl('the_vm', '--verbose', '--username', '"vagrant"', '--password', '"vagrant"').build().line;
            expect(line1).to.equal(line2);
        });

        it('should create a guestcontrol command', () => {
            let guestControl = new VBoxManage().nologo().guestControl('the_vm').verbose().username('vagrant').password('vagrant').build();
            let commandline = `${VBoxManage.determineBinaryPath()} --nologo guestcontrol "the_vm" --verbose --username "vagrant" --password "vagrant"`;
            expect(guestControl.line).to.equal(commandline);
        });

        describe('Run', () => {
            it('should create a run command with program and args either by specifying each separately or as arg list', () => {
                let vm = 'crazy_vm';
                let windowsProgram = 'C:\\Windows\\System32\\wbem\\WMIC.exe';
                let guestControl = new VBoxManage().nologo().guestControl(vm).verbose().username('vagrant').password('vagrant');
                let run1 = guestControl.run().program(windowsProgram).arg('diskdrive').arg('get').arg('Manufacturer').arg('/value').build();
                let run2 = guestControl.run('--wait-stdout', '--wait-stderr').program(windowsProgram).args('diskdrive', 'get', 'Manufacturer', '/value').build();

                let commandline1 = `${VBoxManage.determineBinaryPath()} --nologo guestcontrol "${vm}" --verbose --username "vagrant" --password "vagrant" run -- "${windowsProgram}" diskdrive get Manufacturer /value`;
                let commandline2 = `${VBoxManage.determineBinaryPath()} --nologo guestcontrol "${vm}" --verbose --username "vagrant" --password "vagrant" run --wait-stdout --wait-stderr -- "${windowsProgram}" diskdrive get Manufacturer /value`;
                expect(run1.line).to.equal(commandline1);
                expect(run2.line).to.equal(commandline2);
            });
        })
    })
});
