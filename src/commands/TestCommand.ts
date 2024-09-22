// // import * as fs from 'fs';
// import { exec } from 'child_process';

// export class TestCommand {
//   public static run(): void {
//     console.log('Running tests...');
//     this.runTests((testError) => {
//       if(testError) {
//         console.error('Error running tests:', testError);
//         return; 
//       }
//     });
//   }

//   private static runTests(callback: (error: string | null) => void): void {
//     exec('npm test', (error, stdout, stderr) => {
//       if (error) {
//         return callback(`Error running tests: ${stderr}`);
//       }
//       console.log(`Test results: ${stdout}`);
//       callback(null);
//     });
//   }


// }

import { exec } from 'child_process';
import * as fs from 'fs';

export class TestCommand {
  public static run(): void {
    console.log('Running tests...');
    this.runTests((testError, testResults) => {
      if (testError) {
        console.error('Error running tests:', testError);
        return;
      }
      this.runCoverage((coverageError, coverageResults) => {
        if (coverageError) {
          console.error('Error running coverage:', coverageError);
          return;
        }
        this.printResults(testResults, coverageResults);
      });
    });
  }

  private static runTests(callback: (error: string | null, results?: any) => void): void {
    exec('npm test -- --json --outputFile=test-results.json', (error, _, stderr) => {
      if (error) {
        return callback(`Error running tests: ${stderr}`);
      }
      const testResults = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
      callback(null, testResults);
    });
  }

  private static runCoverage(callback: (error: string | null, results?: any) => void): void {
    exec('npm run coverage', (error, _, stderr) => {
      if (error) {
        return callback(`Error running coverage: ${stderr}`);
      }
      const coverageResults = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));
      callback(null, coverageResults);
    });
  }

  private static printResults(testResults: any, coverageResults: any): void {
    const totalTests = testResults.numTotalTests;
    const passedTests = testResults.numPassedTests;
    const coverage = coverageResults.total.lines.pct;

    console.log(`${passedTests}/${totalTests} test cases passed. ${coverage}% line coverage achieved.`);
  }
}