import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

abstract class API {
  protected package_name: string;
  constructor(name: string) {
    this.package_name = name;
  }
  public abstract getData(request_string?: string, args?: any): Promise<any>;
}

export class GitHub extends API {
  private owner_name: string;
  constructor(p_name: string, own_name: string) {
    super(p_name);
    this.owner_name = own_name;
  }

  public async getData(request_string: string, args?: any): Promise<any> {
    const url = "https://api.github.com/graphql";
    const headers = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    };
    const data = {
      query: request_string,
      variables: {
        owner: this.owner_name,
        repo: this.package_name,
        ...args,
      },
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching package info:", error);
      throw error;
    }
  }
}

export class NPM extends API {
  constructor(p_name: string) {
    super(p_name);
  }

  public async getData(): Promise<any> {
    const url = `https://registry.npmjs.org/${this.package_name}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching package info: ${response.statusText}`);
      }
      const data = await response.json();
      const latestVersion = data["dist-tags"].latest;
      const latestVersoinData = data.versions[latestVersion];
      const gitHubAPI = latestVersoinData.repository.url;
      if (gitHubAPI) {
        return gitHubAPI;
      } else {
        throw new Error("No GitHub repository found");
      }
    } catch (error) {
      console.error("Error fetching package info:", error);
      throw error;
    }
  }
}

// Example usage
const github = new GitHub("graphql.js", "octokit");
// const npm = new NPM("express");
async function test() {
  let result: any = await github.getData(`
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
}
test();
// console.log(result.);
// npm.getData("").then(result => console.log(result)).catch(error => console.error(error));
