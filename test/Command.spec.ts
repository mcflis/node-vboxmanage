import { Command } from '../lib';
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

const expect = chai.expect;

describe('Command', () => {
    before(() => {
        chai.should();
        chai.use(chaiAsPromised);
    });

    it('should provide read access to options', () => {
        let command = new Command({binaryPath: 'ls', args: ['-lah']});
        expect(command.line).to.be.a('string');
        expect(command.args).to.be.an('array');
        expect(command.binaryPath).to.be.a('string');
    });

    it('should be executed successfully', () => {
        let args: string[] = ['-lah'];
        let command = new Command({binaryPath: 'ls', args: args});
        return expect(command.execute()).to.be.fulfilled;
    });

    it('should fail on non-zero exit', (done) => {
        let args: string[] = ['this-does-not-exist'];
        let command = new Command({binaryPath: 'which', args: args});
        let result = command.execute();
        expect(result).to.be.rejected.then(error => {
            expect(error).to.have.property('code').that.is.not.equal(0);
        }).should.notify(done);
    });
});
