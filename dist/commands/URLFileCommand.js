var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import { Git_Hub, NPM } from '../api.js';
export class URLFileCommand {
    static run(file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Processing URL file: ${file}`);
            fs.readFile(file, 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(`Error reading ${file}:`, err);
                    process.exit(1);
                    return;
                }
                const urls = data.split('\n').map(url => url.trim()).filter(url => url !== '');
                for (let url of urls) {
                    if (url.includes('github.com')) {
                        if (url.includes('%0D')) {
                            url = url.replace('%0D', '');
                        }
                        if (url.includes('\r')) {
                            url = url.replace('\r', '');
                        }
                        console.log(`GitHub package: ${url}`);
                        const [owner, repo] = url.split('github.com/')[1].split('/');
                        const githubRepo = new Git_Hub(repo, owner);
                        const data = yield githubRepo.getData();
                        console.log("GitHub Data:", data);
                    }
                    else if (url.includes('npmjs.com')) {
                        console.log(`npm package: ${url}`);
                        const packageName = url.split('package/')[1];
                        const npmPackage = new NPM(packageName);
                        const data = yield npmPackage.getData();
                        console.log("NPM Data:");
                        const npmData = data;
                        npmData.objects.forEach((obj) => {
                            console.log(`Package Name: ${obj.package.name}`);
                            console.log(`Version: ${obj.package.version}`);
                            console.log(`Description: ${obj.package.description}`);
                            console.log(`Score: ${obj.score.final}`);
                            console.log('-----------------------------');
                        });
                    }
                    else {
                        console.log(`Unknown package source: ${url}`);
                    }
                }
            }));
        });
    }
}
