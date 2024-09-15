import { resourceLimits } from 'worker_threads';
import { Git_Hub } from '../api.js';

async function fetchIssues(owner: string, repo: string): Promise<any> {
  const githubRepo = new Git_Hub(repo, owner);
  let totalBugIssues = 0;
  let totalIssues = 0;
  let closedIssues = 0;
  let titles = [];

    const query = `
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
    `;

    const result = await githubRepo.getData(query,null);
  return result;
}
async function calculateLOC(owner: string, repo: string): Promise<number> {
  const githubRepo = new Git_Hub(repo, owner);
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

  const result = await githubRepo.getData(query,null);

  let totalLines = 0;
  function countLines(text: string) {
    return text.split('\n').length;
  }

  function traverseTree(entries: any) {
    if (!entries) return;
    entries.forEach((entry: any) => {
      if (entry.type === "blob" && entry.object && entry.object.text) {
        totalLines += countLines(entry.object.text);
      } else if (entry.type === "tree" && entry.object && entry.object.entries) {
        traverseTree(entry.object.entries); // Recursively traverse subdirectories
      }
    });
  }

  if (result.repository.object && result.repository.object.entries) {
    traverseTree(result.repository.object.entries);
  } else {
    console.error("No entries found in the repository object.");
  }

  return totalLines;
}

async function calculateCorrectness(owner: string, repo: string) {
  const issuesData = await fetchIssues(owner, repo);
  const totalLinesOfCode = await calculateLOC(owner, repo);

  const totalIssues = issuesData.repository.issues.totalCount;
  const resolvedIssues = issuesData.repository.closedIssues.totalCount;
  const totalBugs = issuesData.repository.bugIssues.totalCount;

  const resolvedIssuesRatio = totalIssues > 0 ? resolvedIssues / totalIssues : 1;
  const normalizedBugRatio = totalLinesOfCode > 0 ? totalBugs / totalLinesOfCode : 0;

  // Adjust weights as needed
  const correctness = (0.7 * resolvedIssuesRatio) + (0.3 * (1 - normalizedBugRatio));

  // console.log(`Total Issues: ${totalIssues}`);
  // console.log(`Resolved Issues: ${resolvedIssues}`);
  // console.log(`Total Bugs: ${totalBugs}`);
  // console.log(`Total Lines of Code: ${totalLinesOfCode}`);
  console.log(`Correctness: ${correctness}`);
}
export default calculateCorrectness;

calculateCorrectness("octokit", "graphql.js").catch(console.error);
