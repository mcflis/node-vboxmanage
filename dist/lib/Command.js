"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Command = (function () {
    function Command(cmd) {
        this._args = cmd.args;
        this._binaryPath = cmd.binaryPath;
    }
    Object.defineProperty(Command.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "line", {
        get: function () {
            return [this._binaryPath].concat(this._args).join(' ').trim();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "binaryPath", {
        get: function () {
            return this._binaryPath;
        },
        enumerable: true,
        configurable: true
    });
    Command.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var output = '';
            var child = child_process_1.spawn(_this._binaryPath, _this._args);
            child.stdout.on('data', function (data) {
                output += data.toString();
            });
            child.stderr.on('data', function (data) {
                output += data.toString();
            });
            child.on('close', function () {
                resolve(output);
            });
            child.on('exit', function (code) {
                if (code !== 0) {
                    reject({ code: code, error: new Error(output) });
                }
            });
        });
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map