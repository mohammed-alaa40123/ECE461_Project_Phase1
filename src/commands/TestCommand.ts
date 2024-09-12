import * as fs from 'fs';
import { exec } from 'child_process';

export class TestCommand {
  public static run(url: string): void {
    console.log('Running tests...');
    this.cloneRepository(url, (cloneError) => {
      if (cloneError) {
        console.error('Error cloning repository:', cloneError);
        return; 
      }
      this.runTests((testError) => {
        if(testError) {
          console.error('Error running tests:', testError);
          return; 
        }
      });
    });
  }

  private static cloneRepository(url: string, callback: (error: string | null) => void): void {
    const repoName = url.split('/').pop()?.replace('.git', '');
    exec(`git clone ${url}`, (error, stdout, stderr) => {
      if (error) {
        return callback(`Error cloning repository: ${stderr}`);
      }
      console.log(`Repository cloned: ${stdout}`);
      process.chdir(repoName || '');
      callback(null);
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