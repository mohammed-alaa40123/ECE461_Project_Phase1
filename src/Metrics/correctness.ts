import { graphql } from "@octokit/graphql";
import * as dotenv from "dotenv";
dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

const GITHUB_TOKEN = env.GITHUB_TOKEN; // Replace with your GitHub token


const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

interface IssueData {
  repository: {
    issues: {
      totalCount: number;
    };
    closedIssues: {
      totalCount: number;
    };
    bugIssues: {
      totalCount: number;
    };
  };
}

async function fetchIssues(owner: string, repo: string): Promise<IssueData> {
  const query = `
    query IssuesQuery($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) { 
        issues {
          totalCount
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
        bugIssues: issues(first: 100, labels: ["type: bug"]) {
          totalCount
        }
      }
    }
  `;

  const result: IssueData = await graphqlWithAuth(query, {
    owner,
    repo,
  });

  return result;
}

async function calculateLOC(owner: string, repo: string): Promise<number> {
  const query = `{
    repository(owner: "${owner}", name: "${repo}") {
      object(expression: "HEAD:") {
        ... on Tree {
          entries {
            name
            type
            object {
              ... on Blob {
                text
              }
              ... on Tree {
                entries {
                  name
                  type
                  object {
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  const result:any = await graphqlWithAuth(query, { owner, repo });

  let totalLines = 0;
  function countLines(text: string) {
    return text.split('\n').length;
  }

  function traverseTree(entries: any) {
    if(!entries)   return;
    entries.forEach((entry: any) => {
      if (entry.type === "blob" && entry.object.text) {
        totalLines += countLines(entry.object.text);
      } else if (entry.type === "tree") {
        traverseTree(entry.object.entries); // Recursively traverse subdirectories
      }
    });
  }

  traverseTree(result.repository.object.entries);
  return totalLines;
}

async function calculateCorrectness(owner: string, repo: string) {
  const issuesData = await fetchIssues(owner, repo);
  const totalLinesOfCode = await calculateLOC(owner, repo);

  const totalIssues = issuesData.repository.issues.totalCount;
  const resolvedIssues = issuesData.repository.closedIssues.totalCount;
  const totalBugs = issuesData.repository.bugIssues.totalCount;

  const correctness = (
    (resolvedIssues / totalIssues) +
    (totalBugs / totalLinesOfCode)
  ) / 2;

//   console.log(`Total Issues: ${totalIssues}`);
//   console.log(`Resolved Issues: ${resolvedIssues}`);
//   console.log(`Total Bugs: ${totalBugs}`);
//   console.log(`Total Lines of Code: ${totalLinesOfCode}`);
  console.log(`Correctness: ${correctness}`);
}
export default calculateCorrectness;
