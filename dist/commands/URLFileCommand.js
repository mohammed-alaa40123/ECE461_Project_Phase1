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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLFileCommand = void 0;
const fs = __importStar(require("fs"));
const Netscore_js_1 = __importDefault(require("../Metrics/Netscore.js"));
class URLFileCommand {
    static run(file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Processing URL file: ${file}`);
            fs.readFile(file, "utf8", (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(`Error reading ${file}:`, err);
                    process.exit(1);
                    return;
                }
                const urls = data
                    .split("\n")
                    .map((url) => url.trim())
                    .filter((url) => url !== "");
                for (let url of urls) {
                    if (url.includes("github.com")) {
                        console.log(`GitHub package: ${url}`);
                        const [owner, repo] = url.split("github.com/")[1].split("/");
                        const result = yield (0, Netscore_js_1.default)(owner, repo);
                        console.log(result);
                    }
                    else if (url.includes("npmjs.com")) {
                        console.log(`npm package: ${url}`);
                        // const packageName = url.split('package/')[1];
                        // try {
                        //   const correctnessResult = await wrappedCalculateCorrectness(packageName);
                        //   console.log(`calculateCorrectness result: ${correctnessResult}`);
                        // } catch (error) {
                        //   console.error(`Error in calculateCorrectness for ${url}:`, error);
                        // }
                        // try {
                        //   const licenseResult = await wrappedCheckLicenseCompatibility(packageName);
                        //   console.log(`checkLicenseCompatibility result: ${licenseResult}`);
                        // } catch (error) {
                        //   console.error(`Error in checkLicenseCompatibility for ${url}:`, error);
                        // }
                    }
                    else {
                        console.log(`Unknown package source: ${url}`);
                    }
                }
            }));
        });
    }
}
exports.URLFileCommand = URLFileCommand;
