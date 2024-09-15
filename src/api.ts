import { graphql } from "@octokit/graphql";
import fetch from "node-fetch";

import * as dotenv from "dotenv";
dotenv.config();
const env: NodeJS.ProcessEnv = process.env;




abstract class API {
  protected package_name: string;
  constructor(name: string) {
    this.package_name = name;
  }
  public abstract getData(request_string: string): Promise<any>;
}

export class Git_Hub extends API {
  private owner_name: string;
  constructor(p_name: string, own_name: string) {
    super(p_name);
    this.owner_name = own_name;
  }

  public async getData(request_string: string): Promise<any> {
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    });

    try {
      const response = await graphqlWithAuth(request_string, {
        owner: this.owner_name,
        repo: this.package_name,
      });
      // console.log("Package info fetched successfully");
      return response;
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

  public async getData(request_string: string): Promise<any> {
    const url = `https://registry.npmjs.org/${this.package_name}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching package info: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Package info fetched successfully");
      return data;
    } catch (error) {
      console.error("Error fetching package info:", error);
      throw error;
    }
  }
}

// Example usage
// const github = new Git_Hub("Hello-World", "octocat");
// const npm = new NPM("express");

// github.getData(`
//   query($owner: String!, $repo: String!) {
//     repository(owner: $owner, name: $repo) {
//       licenseInfo {
//         name
//         spdxId
//       }
//     }
//   }
// `).then(result => console.log(result)).catch(error => console.error(error));

// npm.getData("").then(result => console.log(result)).catch(error => console.error(error));

export default { Git_Hub, NPM };