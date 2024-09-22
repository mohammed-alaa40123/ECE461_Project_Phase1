import { GitHub, NPM } from "../api.js";

const repo_query = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      diskUsage
    }
  }
`;

const issues_query = `
  query($owner: String!, $name: String!, $first: Int!) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, states: CLOSED) {
        edges {
          node {
            createdAt
            comments(first: 1) {
              edges {
                node {
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`;
interface RepoQueryResponse {
  data: {
    repository: {
      diskUsage: number;
    };
  };
}

interface Issue {
  node: {
    createdAt: string;
    comments: {
      edges: {
        node: {
          createdAt: string;
        };
      }[];
    };
  };
}

interface IssueQueryResponse {
  data: {
    repository: {
      issues: {
        edges: Issue[];
      };
    };
  };
}

async function getIssueResponseTimes(
  owner: string,
  name: string
): Promise<void> {
  const git_repo = new GitHub(name, owner);

  const responseTimes: number[] = [];
  let number_of_issues: number = 0;

  try {
    const repo_result: RepoQueryResponse = await git_repo.getData(repo_query, {
      owner,
      name,
    });

    const repoSize: number = repo_result.data.repository.diskUsage / 1024;

    if (repoSize > 100) {
      number_of_issues = 100;
    } else if (repoSize > 50) {
      number_of_issues = 90;
    } else {
      number_of_issues = 80;
    }

    console.log(repo_result);

    const issue_result: IssueQueryResponse = await git_repo.getData(
      issues_query,
      {
        owner,
        name,
        first: number_of_issues,
      }
    );
    console.log(issue_result);
    const issues: Issue[] = issue_result.data.repository.issues.edges;

    issues.forEach((issue: Issue) => {
      const createdAt: Date = new Date(issue.node.createdAt);
      const firstComment = issue.node.comments.edges[0];
      if (firstComment) {
        const firstResponseAt: Date = new Date(firstComment.node.createdAt);
        const responseTime: number =
          (firstResponseAt.getTime() - createdAt.getTime()) /
          (1000 * 60 * 60 * 24 * 30); // in months
        responseTimes.push(responseTime);
      }
    });

    responseTimes.sort((a, b) => a - b);

    const totalResponseTime: number = responseTimes.reduce(
      (sum, time) => sum + time,
      0
    );
    const averageResponseTime: number =
      totalResponseTime / responseTimes.length;

    const Responsiveness: number = 1 - averageResponseTime / number_of_issues;

    // let Responsiveness: number = 0;

    // if (averageResponseTime < 1) {
    //   Responsiveness = 1;
    // } else if (averageResponseTime > 6) {
    //   Responsiveness = 1;
    // } else {
    //   Responsiveness = 1 - averageResponseTime / 6;
    // }

    console.log("Responsiveness:", Responsiveness);
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
  }
}

async function getNpmPackageInfo(packageName: string): Promise<void> {
  const npm_repo = new NPM(packageName);

  try {
    const response = await npm_repo.getData();
    if (response) {
      console.log(response.split("/"));
      const response_splitted = response.split("/");
      const owner: string = response.split("/")[response_splitted.length - 2];
      console.log(owner);
      const name: string = response
        .split("/")
        [response_splitted.length - 1].split(".")[0];
      console.log(name);
      getIssueResponseTimes(owner, name);
    }
  } catch (error) {
    console.error(`Error fetching package info for ${packageName}:`, error);
  }
}

// Example usage
const owner: string = "facebook"; // Replace with the owner
const name: string = "react"; // Replace with the repository name

getIssueResponseTimes(owner, name);
// console.log("Fetching npm package info...");
getNpmPackageInfo(name);
