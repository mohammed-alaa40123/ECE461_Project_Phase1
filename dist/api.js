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
exports.NPM = exports.GitHub = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const env = process.env;
class API {
    constructor(name) {
        this.package_name = name;
    }
}
class GitHub extends API {
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
                const response = yield axios_1.default.post(url, data, { headers });
                return response.data;
            }
            catch (error) {
                console.error("Error fetching package info:", error);
                throw error;
            }
        });
    }
}
exports.GitHub = GitHub;
class NPM extends API {
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
exports.NPM = NPM;
// Example usage
const github = new GitHub("graphql.js", "octokit");
// const npm = new NPM("express");
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
        // console.log(result.data.repository.issues.totalCount);
    });
}
test();
// console.log(result.);
// npm.getData("").then(result => console.log(result)).catch(error => console.error(error));
exports.default = { GitHub, NPM };
