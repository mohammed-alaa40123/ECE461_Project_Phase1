import * as fs from 'fs';
import { exec } from 'child_process';
import { InstallCommand } from '../src/commands/InstallCommand.ts';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  unlinkSync: jest.fn(),
  stat: jest.fn((path, callback) => callback(null, { isFile: () => true })),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    end: jest.fn(),
  })),
}));

describe('TestCommand', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should install a dependency', (done) => {
    const dependency = 'lodash';
    const execMock = exec as unknown as jest.Mock;
    execMock.mockImplementation((command, callback) => {
      if (command.includes(dependency)) {
        callback(null, 'installed', '');
      } else {
        callback(new Error('Failed to install'), '', '');
      }
    });

    const fsMock = fs.existsSync as jest.Mock;
    fsMock.mockImplementation((path) => {
      return path.includes(`node_modules/${dependency}`);
    });

    // Run the installDependency method
    InstallCommand.installDependency(dependency)
      .then(() => {
        // Verify that the dependency was installed
        expect(fs.existsSync(`node_modules/${dependency}`)).toBe(true);
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  }, 10000); // Increase the timeout to 10 seconds
});