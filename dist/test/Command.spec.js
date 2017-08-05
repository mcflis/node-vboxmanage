"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../lib");
require("mocha");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
describe('Command', function () {
    before(function () {
        chai.should();
        chai.use(chaiAsPromised);
    });
    it('should provide read access to options', function () {
        var command = new lib_1.Command({ binaryPath: 'ls', args: ['-lah'] });
        expect(command.line).to.be.a('string');
        expect(command.args).to.be.an('array');
        expect(command.binaryPath).to.be.a('string');
    });
    it('should be executed successfully', function () {
        var args = ['-lah'];
        var command = new lib_1.Command({ binaryPath: 'ls', args: args });
        return expect(command.execute()).to.be.fulfilled;
    });
    it('should fail on non-zero exit', function (done) {
        var args = ['this-does-not-exist'];
        var command = new lib_1.Command({ binaryPath: 'which', args: args });
        var result = command.execute();
        expect(result).to.be.rejected.then(function (error) {
            expect(error).to.have.property('code').that.is.not.equal(0);
        }).should.notify(done);
    });
});
//# sourceMappingURL=Command.spec.js.map