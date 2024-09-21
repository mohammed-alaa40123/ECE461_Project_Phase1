"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommand = void 0;
// import * as fs from 'fs';
var child_process_1 = require("child_process");
var TestCommand = /** @class */ (function () {
    function TestCommand() {
    }
    TestCommand.run = function () {
        console.log('start of the run tests function');
        console.log('Running tests...');
        this.runTests(function (testError) {
            if (testError) {
                console.error('Error running tests:', testError);
                return;
            }
        });
    };
    TestCommand.runTests = function (callback) {
        console.log('about to execute npm test');
        (0, child_process_1.exec)('npm test', function (error, stdout, stderr) {
            if (error) {
                return callback("Error running tests: ".concat(stderr));
            }
            console.log("Test results: ".concat(stdout));
            callback(null);
        });
    };
    return TestCommand;
}());
exports.TestCommand = TestCommand;
