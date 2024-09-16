var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const env = process.env;
class API {
    constructor(name) {
        this.package_name = name;
    }
}
export class GitHub extends API {
    constructor(p_name, own_name) {
        super(p_name);
        this.owner_name = own_name;
    }
    getData(request_string, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://api.github.com/graphql';
            const headers = {
                Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            };
            const data = {
                query: request_string,
                variables: Object.assign({ owner: this.owner_name, repo: this.package_name }, args),
            };
            try {
                const response = yield axios.post(url, data, { headers });
                return response.data;
            }
            catch (error) {
                console.error("Error fetching package info:", error);
                throw error;
            }
        });
    }
}
export class NPM extends API {
    constructor(p_name) {
        super(p_name);
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://registry.npmjs.org/${this.package_name}`;
            try {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching package info: ${response.statusText}`);
                }
                const data = yield response.json();
                console.log("Package info fetched successfully");
                return data;
            }
            catch (error) {
                console.error("Error fetching package info:", error);
                throw error;
            }
        });
    }
}
const github = new GitHub("graphql.js", "octokit");
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield github.getData(`
        query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) { 
          issues {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          bugIssues: issues(first: 5, labels: ["type: bug"]) {
            totalCount
          }
        }
      }
`);
        return result;
    });
}
test();
export default { GitHub, NPM };
