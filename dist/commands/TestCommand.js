"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommand = void 0;
// import * as fs from 'fs';
const child_process_1 = require("child_process");
class TestCommand {
    static run() {
        console.log('Running tests...');
        this.runTests((testError) => {
            if (testError) {
                console.error('Error running tests:', testError);
                return;
            }
        });
    }
    static runTests(callback) {
        (0, child_process_1.exec)('npm test', (error, stdout, stderr) => {
            if (error) {
                return callback(`Error running tests: ${stderr}`);
            }
            console.log(`Test results: ${stdout}`);
            callback(null);
        });
    }
}
exports.TestCommand = TestCommand;
