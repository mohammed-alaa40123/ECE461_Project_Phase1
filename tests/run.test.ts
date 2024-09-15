import * as fs from 'fs';
import { exec } from 'child_process';
import { InstallCommand } from '../src/commands/InstallCommand.ts';

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