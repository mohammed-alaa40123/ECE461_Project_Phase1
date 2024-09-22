"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallCommand = void 0;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
//import logger from '../logger';
class InstallCommand {
    static installDependency(dep) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`npm install ${dep}`, (err, stdout) => {
                if (err) {
                    console.error(`Error installing ${dep}:`, err);
                    //logger.error(`Error installing ${dep}:`, err);
                    reject(err);
                    return;
                }
                //logger.info(`Successfully installed ${dep}`);
                console.log(`Successfully installed ${dep}`);
                console.log('-----------------------------');
                console.log(stdout);
                // console.error(stderr);
                resolve();
            });
        });
    }
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            //logger.startup('Starting dependency installation');
            console.log('Installing dependencies...');
            fs.readFile('userland.txt', 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error('Error reading userland.txt:', err);
                    //logger.error('Error reading userland.txt:', err);
                    process.exit(1);
                    return;
                }
                const dependencies = data.split('\n').filter(dep => dep.trim() !== '');
                try {
                    for (const dep of dependencies) {
                        yield InstallCommand.installDependency(dep);
                    }
                    console.log('Dependencies installed successfully!');
                    //logger.info('Dependencies installed successfully!');
                    process.exit(0);
                }
                catch (_a) {
                    console.error('Error installing dependencies');
                    //logger.error('Error installing dependencies');
                    process.exit(1);
                }
            }));
        });
    }
}
exports.InstallCommand = InstallCommand;
