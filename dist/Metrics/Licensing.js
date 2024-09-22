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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
const compatibilityTable = {
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
    "CC-BY-NC-ND-4.0": 0,
};
function cloneRepository(url, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the directory is empty
        if (fs_1.default.existsSync(dir)) {
            fs_1.default.rmSync(dir, { recursive: true, force: true });
        }
        fs_1.default.mkdirSync(dir, { recursive: true });
        // Clone the repository
        yield git.clone(url, dir, ['--depth', '1']);
    });
}
function getLicense(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const licenseFilePath = path_1.default.join(dir, 'LICENSE');
        if (fs_1.default.existsSync(licenseFilePath)) {
            return fs_1.default.readFileSync(licenseFilePath, 'utf8');
        }
        return null;
    });
}
function determineLicenseScore(licenseContent) {
    const lines = licenseContent.split('\n');
    if (lines.length > 1) {
        const licenseLine = lines[0].trim();
        // console.log(`Detected license line: ${licenseLine}`);
        for (const [license, score] of Object.entries(compatibilityTable)) {
            if (licenseLine.includes(license)) {
                // console.log(`Detected license type: ${license}`);
                return score;
            }
        }
    }
    return 0; // Default score if no matching license is found
}
function checkLicenseCompatibility(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://github.com/${owner}/${repo}`;
        const dir = '/tmp/cloned-repo';
        yield cloneRepository(url, dir);
        const licenseContent = yield getLicense(dir);
        if (licenseContent) {
            // console.log(`License:\n${licenseContent}`);
            return determineLicenseScore(licenseContent);
        }
        else {
            // console.log('License file not found.');
            return 0;
        }
    });
}
exports.default = checkLicenseCompatibility;
