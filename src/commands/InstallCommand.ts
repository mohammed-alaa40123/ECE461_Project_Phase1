import * as fs from 'fs';
import { exec } from 'child_process';
import logger from '../logger.js';

export class InstallCommand {
  public static installDependency(dep: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`npm install ${dep}`, (err, stdout) => {
        if (err) {
          console.error(`Error installing ${dep}:`, err);
          logger.error(`Error installing ${dep}:`, err);
          reject(err);
          return;
        }
        logger.info(`Successfully installed ${dep}`);
        console.log(`Successfully installed ${dep}`);
        console.log('-----------------------------');
        console.log(stdout);
        resolve();
      });
    });
  }

  public static async run(): Promise<void> {
    logger.startup('Starting dependency installation');
    console.log('Installing dependencies...');
    fs.readFile('userland.txt', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading userland.txt:', err);
        logger.error('Error reading userland.txt:', err);
        process.exit(1);
        return;
      }

      const dependencies = data.split('\n').filter(dep => dep.trim() !== '');

      try {
        for (const dep of dependencies) {
          await InstallCommand.installDependency(dep);
        }
        console.log('Dependencies installed successfully!');
        logger.info('Dependencies installed successfully!');
        process.exit(0);
      } catch {
        console.error('Error installing dependencies');
        logger.error('Error installing dependencies');
        process.exit(1);
      }
    });
  }
}