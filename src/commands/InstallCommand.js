"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallCommand = void 0;
var fs = require("fs");
var child_process_1 = require("child_process");
//import logger from '../logger';
var InstallCommand = /** @class */ (function () {
    function InstallCommand() {
    }
    InstallCommand.installDependency = function (dep) {
        return new Promise(function (resolve, reject) {
            (0, child_process_1.exec)("npm install ".concat(dep), function (err, stdout, stderr) {
                if (err) {
                    console.error("Error installing ".concat(dep, ":"), err);
                    //logger.error(`Error installing ${dep}:`, err);
                    reject(err);
                    return;
                }
                //logger.info(`Successfully installed ${dep}`);
                console.log("Successfully installed ".concat(dep));
                console.log('-----------------------------');
                console.log(stdout);
                console.error(stderr);
                resolve();
            });
        });
    };
    InstallCommand.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                //logger.startup('Starting dependency installation');
                console.log('Installing dependencies...');
                fs.readFile('userland.txt', 'utf8', function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                    var dependencies, _i, dependencies_1, dep, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (err) {
                                    console.error('Error reading userland.txt:', err);
                                    //logger.error('Error reading userland.txt:', err);
                                    process.exit(1);
                                    return [2 /*return*/];
                                }
                                dependencies = data.split('\n').filter(function (dep) { return dep.trim() !== ''; });
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, , 7]);
                                _i = 0, dependencies_1 = dependencies;
                                _b.label = 2;
                            case 2:
                                if (!(_i < dependencies_1.length)) return [3 /*break*/, 5];
                                dep = dependencies_1[_i];
                                return [4 /*yield*/, InstallCommand.installDependency(dep)];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5:
                                console.log('Dependencies installed successfully!');
                                //logger.info('Dependencies installed successfully!');
                                process.exit(0);
                                return [3 /*break*/, 7];
                            case 6:
                                _a = _b.sent();
                                console.error('Error installing dependencies');
                                //logger.error('Error installing dependencies');
                                process.exit(1);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return InstallCommand;
}());
exports.InstallCommand = InstallCommand;
