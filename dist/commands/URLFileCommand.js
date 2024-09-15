var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import { timeWrapper } from "../timeWrapper.js";
import calculateCorrectness from "../Metrics/Correctness.js";
import checkLicenseCompatibility from "../Metrics/Licensing.js";
export class URLFileCommand {
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
                const wrappedCalculateCorrectness = timeWrapper(calculateCorrectness, "calculateCorrectness");
                const wrappedCheckLicenseCompatibility = timeWrapper(checkLicenseCompatibility, "checkLicenseCompatibility");
                for (let url of urls) {
                    if (url.includes("github.com")) {
                        console.log(`GitHub package: ${url}`);
                        const [owner, repo] = url.split("github.com/")[1].split("/");
                        try {
                            yield wrappedCalculateCorrectness(owner, repo);
                        }
                        catch (error) {
                            console.error(`Error in calculateCorrectness for ${url}:`, error);
                        }
                        try {
                            yield wrappedCheckLicenseCompatibility(owner, repo);
                        }
                        catch (error) {
                            console.error(`Error in checkLicenseCompatibility for ${url}:`, error);
                        }
                    }
                    else if (url.includes("npmjs.com")) {
                        console.log(`npm package: ${url}`);
                    }
                    else {
                        console.log(`Unknown package source: ${url}`);
                    }
                }
            }));
        });
    }
}
