import { exec } from 'child_process';
export class TestCommand {
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
        exec('npm test', (error, stdout, stderr) => {
            if (error) {
                return callback(`Error running tests: ${stderr}`);
            }
            console.log(`Test results: ${stdout}`);
            callback(null);
        });
    }
}
