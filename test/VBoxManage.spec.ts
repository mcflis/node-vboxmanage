import VBoxManage from "../lib/index";
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import * as mockSpawn from 'mock-spawn';
import child_process = require('child_process');

const expect = chai.expect;

describe('VBoxManage', () => {
    let mySpawn = mockSpawn();
    let originalSpawn = child_process.spawn;
    let spawnSpy: sinon.SinonSpy;

    before(() => {
        chai.should();
        chai.use(sinonChai);
        chai.use(chaiAsPromised);
        child_process.spawn = mySpawn;
        spawnSpy = sinon.spy(child_process, 'spawn');
    });

    beforeEach(() => {
        spawnSpy.reset();
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

    it('should execute the vboxmanage command with the given params', () => {
        let vboxmanage = new VBoxManage().nologo().version().build();
        return expect(vboxmanage.execute()).to.be.fulfilled.then(() => {
            expect(spawnSpy).to.be.calledWith(VBoxManage.determineBinaryPath(), ['--nologo', '--version']);
        })
    });

    describe('GuestControl', () => {
        it('should execute the vboxmanage guestcontrol command with the given params', () => {
            let vboxmanage = new VBoxManage().nologo().guestControl('the_vm').verbose().username('vagrant').password('vagrant').build();
            return expect(vboxmanage.execute()).to.be.fulfilled.then(() => {
                expect(spawnSpy).to.be.calledWith(VBoxManage.determineBinaryPath(), ['--nologo', 'guestcontrol', '"the_vm"', '--verbose', '--username', '"vagrant"', '--password', '"vagrant"']);
            })
        });

        describe('Run', () => {
            it('should execute the vboxmanage guestcontrol run command with the given params', () => {
                let vm = 'crazy_vm';
                let windowsProgram = 'C:\\Windows\\System32\\wbem\\WMIC.exe';
                let vboxmanage = new VBoxManage().nologo()
                    .guestControl(vm).verbose().username('vagrant').password('vagrant')
                    .run().program(windowsProgram).arg('diskdrive').arg('get').arg('Manufacturer').arg('/value').build();
                return expect(vboxmanage.execute()).to.be.fulfilled.then(() => {
                    expect(spawnSpy).to.be.calledWith(VBoxManage.determineBinaryPath(), ['--nologo', 'guestcontrol', `"${vm}"`, '--verbose', '--username', '"vagrant"', '--password', '"vagrant"', 'run', '--', `"${windowsProgram}"`, 'diskdrive', 'get', 'Manufacturer', '/value']);
                })
            });
        })
    });

    after(() => {
        child_process.spawn = originalSpawn;
        spawnSpy.restore();
    });
});
