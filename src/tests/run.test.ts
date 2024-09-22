import { InstallCommand } from '../commands/InstallCommand';

describe('TestCommand', () => {

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
});



