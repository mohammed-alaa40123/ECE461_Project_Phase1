#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const InstallCommand_js_1 = require("./commands/InstallCommand.js");
;
const URLFileCommand_js_1 = require("./commands/URLFileCommand.js");
const TestCommand_js_1 = require("./commands/TestCommand.js");
const program = new commander_1.Command();
program
    .command('install')
    .description('Install dependencies in userland')
    .action(() => {
    InstallCommand_js_1.InstallCommand.run();
});
program
    .command('URL_File <file>')
    .description('Process a URL file')
    .action((file) => {
    URLFileCommand_js_1.URLFileCommand.run(file);
});
program
    .command('test')
    .description('Run tests')
    .action(() => {
    TestCommand_js_1.TestCommand.run();
});
program.parse(process.argv);
