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
        while (_) try {
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
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var simple_git_1 = require("simple-git");
var git = (0, simple_git_1["default"])();
var compatibilityTable = {
    "LGPL-2.1": 1,
    "MIT": 1,
    "GPL-3.0": 0,
    "Apache-2.0": 1,
    "BSD-3-Clause": 1,
    "BSD-2-Clause": 1,
    "MPL-2.0": 0.5,
    "AGPL-3.0": 0,
    "EPL-1.0": 0,
    "EPL-2.0": 0,
    "CC0-1.0": 1,
    "Unlicense": 1,
    "ISC": 1,
    "Zlib": 1,
    "Artistic-2.0": 1,
    "OFL-1.1": 1,
    "EUPL-1.2": 0,
    "LGPL-3.0": 1,
    "GPL-2.0": 0,
    "GPL-2.0+": 0,
    "GPL-3.0+": 0,
    "AGPL-3.0+": 0,
    "LGPL-2.1+": 1,
    "LGPL-3.0+": 1,
    "Apache-1.1": 0,
    "Apache-1.0": 0,
    "CC-BY-4.0": 1,
    "CC-BY-SA-4.0": 0.5,
    "CC-BY-NC-4.0": 0,
    "CC-BY-ND-4.0": 0,
    "CC-BY-NC-SA-4.0": 0,
    "CC-BY-NC-ND-4.0": 0
};
function cloneRepository(url, dir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Ensure the directory is empty
                    if (fs_1["default"].existsSync(dir)) {
                        fs_1["default"].rmSync(dir, { recursive: true, force: true });
                    }
                    fs_1["default"].mkdirSync(dir, { recursive: true });
                    // Clone the repository
                    return [4 /*yield*/, git.clone(url, dir, ['--depth', '1'])];
                case 1:
                    // Clone the repository
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getLicense(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var licenseFilePath;
        return __generator(this, function (_a) {
            licenseFilePath = path_1["default"].join(dir, 'LICENSE');
            if (fs_1["default"].existsSync(licenseFilePath)) {
                return [2 /*return*/, fs_1["default"].readFileSync(licenseFilePath, 'utf8')];
            }
            return [2 /*return*/, null];
        });
    });
}
function determineLicenseScore(licenseContent) {
    var lines = licenseContent.split('\n');
    if (lines.length > 1) {
        var licenseLine = lines[0].trim();
        // console.log(`Detected license line: ${licenseLine}`);
        for (var _i = 0, _a = Object.entries(compatibilityTable); _i < _a.length; _i++) {
            var _b = _a[_i], license = _b[0], score = _b[1];
            if (licenseLine.includes(license)) {
                // console.log(`Detected license type: ${license}`);
                return score;
            }
        }
    }
    return 0; // Default score if no matching license is found
}
function checkLicenseCompatibility(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var url, dir, licenseContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://github.com/".concat(owner, "/").concat(repo);
                    dir = '/tmp/cloned-repo';
                    return [4 /*yield*/, cloneRepository(url, dir)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getLicense(dir)];
                case 2:
                    licenseContent = _a.sent();
                    if (licenseContent) {
                        // console.log(`License:\n${licenseContent}`);
                        return [2 /*return*/, determineLicenseScore(licenseContent)];
                    }
                    else {
                        // console.log('License file not found.');
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = checkLicenseCompatibility;
