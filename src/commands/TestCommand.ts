// import * as fs from 'fs';
import { exec } from 'child_process';

export class TestCommand {
  public static run(): void {
    console.log('Running tests...');
    this.runTests((testError) => {
      if(testError) {
        console.error('Error running tests:', testError);
        return; 
      }
    });
  }

  private static runTests(callback: (error: string | null) => void): void {
    exec('npm test', (error, stdout, stderr) => {
      if (error) {
        return callback(`Error running tests: ${stderr}`);
      }
      console.log(`Test results: ${stdout}`);
      callback(null);
    });
  }


}