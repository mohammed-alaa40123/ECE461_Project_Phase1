var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { graphql } from "@octokit/graphql";
import * as dotenv from "dotenv";
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
            const graphqlWithAuth = graphql.defaults({
                headers: {
                    authorization: `Bearer ${env.GITHUB_TOKEN}`,
                },
            });
            try {
                const response = yield graphqlWithAuth(request_string, Object.assign({ owner: this.owner_name, repo: this.package_name }, args));
                return response;
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
export default { GitHub, NPM };
