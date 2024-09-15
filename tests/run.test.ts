import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { InstallCommand } from '../src/commands/InstallCommand';

import { URLFileCommand } from '../src/commands/URLFileCommand';
import  calculateCorrectness  from '../src/Metrics/correctness';
import  checkLicenseCompatibility  from '../src/Metrics/Licensing';

describe('TestCommand', () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  test('should install a dependency', (done) => {
    const dependency = 'lodash';

    // Capture console output
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Run the installDependency method
    InstallCommand.installDependency(dependency)
      .then(() => {
        // Verify that the dependency was installed
        //expect(fs.existsSync(`node_modules/${dependency}`)).toBe(true);
        expect(consoleLogSpy).toHaveBeenCalledWith('Successfully installed lodash');
        consoleLogSpy.mockRestore();
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  }, 10000); // Increase the timeout to 10 seconds

  //more tests
 

});


// const execAsync = promisify(exec);
// const scriptPath = path.join(__dirname, '../run');

// describe('run script', () => {
//   test('install mode should run successfully', async () => {
//     const { stdout, stderr } = await execAsync(`bash ${scriptPath} install_mode`);
//     expect(stderr).toBe('');
//     expect(stdout).toContain('Running install mode...');
//   });

//   test('url_file_mode should process URL file', async () => {
//     const testFilePath = path.join(__dirname, 'test_urls.txt');
//     const { stdout, stderr } = await execAsync(`bash ${scriptPath} url_file_mode ${testFilePath}`);
//     expect(stderr).toBe('');
//     expect(stdout).toContain(`Processing URL file: ${testFilePath}`);
//   });

//   function isExecError(error: any): error is { stderr: string; code: number } {
//     return typeof error.stderr === 'string' && typeof error.code === 'number';
//   }

//   test('url_file_mode should fail without URL file argument', async () => {
//     try {
//       await execAsync(`bash ${scriptPath} url_file_mode`);
//     } catch (error) {
//       if (isExecError(error)) {
//         expect(error.stderr).toContain('Please provide a URL file.');
//         expect(error.code).toBe(1);
//       } else {
//         throw error; // Re-throw if it's not the expected error type
//       }
//     }
//   });

//   test('test mode should run successfully', async () => {
//     const { stdout, stderr } = await execAsync(`bash ${scriptPath} test_mode`);
//     expect(stderr).toBe('');
//     expect(stdout).toContain('Running tests...');
//   });
// });

// describe('calculateCorrectness', () => {
//   test('should calculate correctness score correctly', async () => {
//     const owner = 'owner';
//     const repo = 'repo';

//     const result = await calculateCorrectness(owner, repo);

//     // Assuming some hypothetical values for the test
//     expect(result).toBeGreaterThanOrEqual(0);
//     expect(result).toBeLessThanOrEqual(1);
//   });

//   test('should handle repositories with no issues', async () => {
//     const owner = 'owner';
//     const repo = 'repoWithNoIssues';

//     const result = await calculateCorrectness(owner, repo);

//     // Assuming the correctness score should be 1 when there are no issues
//     expect(result).toBe(1);
//   });

//   test('should handle repositories with no lines of code', async () => {
//     const owner = 'owner';
//     const repo = 'repoWithNoLOC';

//     const result = await calculateCorrectness(owner, repo);

//     // Assuming the correctness score should be 0 when there are no lines of code
//     expect(result).toBe(0);
//   });
// });

// Mock the dependencies
jest.mock('../src/Metrics/correctness');
jest.mock('../src/Metrics/Licensing');

describe('TestCommand', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should install a dependency', (done) => {
    const dependency = 'lodash';

    // Capture console output
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    InstallCommand.installDependency(dependency)
      .then(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(`Successfully installed ${dependency}`);
        done();
      })
      .catch((error: any) => {
        console.error(error);
        done(error);
      })
      .finally(() => {
        consoleLogSpy.mockRestore();
      });
  });

  test('should correctly parse and filter URLs', () => {
    const mockData = 'https://github.com/owner/repo\n\nhttps://github.com/another/another-repo\n';
    const urls = mockData.split('\n').map(url => url.trim()).filter(url => url !== '');

    expect(urls).toEqual(['https://github.com/owner/repo', 'https://github.com/another/another-repo']);
  });

  test('should call calculateCorrectness with correct arguments', async () => {
    const mockData = 'https://github.com/owner/repo\nhttps://github.com/another/another-repo';
    const mockCalculateCorrectness = calculateCorrectness as jest.Mock;

    // Mock implementations
    mockCalculateCorrectness.mockResolvedValue(true);

    // Call the function with the mock data
    await URLFileCommand.run(mockData);

    // Verify that the mocked function was called with the correct arguments
    expect(mockCalculateCorrectness).toHaveBeenCalledWith('owner', 'repo');
    expect(mockCalculateCorrectness).toHaveBeenCalledWith('another', 'another-repo');
  });

  test('should handle errors in calculateCorrectness correctly', async () => {
    const mockData = 'https://github.com/owner/repo';
    const mockCalculateCorrectness = calculateCorrectness as jest.Mock;

    // Mock implementations
    mockCalculateCorrectness.mockRejectedValue(new Error('Test error'));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function with the mock data
    await URLFileCommand.run(mockData);

    // Verify that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in calculateCorrectness for https://github.com/owner/repo:',
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
 });