#!/usr/bin/env node

import { Command } from 'commander';
import { InstallCommand } from './commands/InstallCommand.js'; ;
import { URLFileCommand } from './commands/URLFileCommand.js';
import { TestCommand } from './commands/TestCommand.js';

const program = new Command();

program
  .command('install')
  .description('Install dependencies in userland')
  .action(() => {
    InstallCommand.run("userland.txt");
  });

program
  .command('URL_File <file>')
  .description('Process a URL file')
  .action((file) => {
    URLFileCommand.run(file);
  });

program
  .command('test')
  .description('Run tests')
  .action(() => {
    TestCommand.run();
  });

program.parse(process.argv);