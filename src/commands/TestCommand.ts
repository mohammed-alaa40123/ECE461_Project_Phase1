import * as fs from 'fs';
import { exec } from 'child_process';
import logger from '../logger.js';

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
    //run 'yarn test' or 'npm test' maybe
    // might need this: npm install --save-dev jest
    //what to use for the actual test cases?
    exec('npm test', (error, stdout, stderr) => {
      if (error) {
        return callback(`Error running tests: ${stderr}`);
      }
      console.log(`Test results: ${stdout}`);
      callback(null);
    });
  }

  //might not need this function as jest should do it automatically

  // private static calculateCoverage(callback: (error: string | null, coverage?: number) => void): void {
  //   fs.readFile('coverage/coverage-summary.json', 'utf8', (err, data) => {
  //     if (err) {
  //       return callback(`Error reading coverage file: ${err}`);
  //     }
  //     const coverageData = JSON.parse(data);
  //     const lineCoverage = coverageData.total.lines.pct;
  //     callback(null, lineCoverage);
  //   });
  // }


}