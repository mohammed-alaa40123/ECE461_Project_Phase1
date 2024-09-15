var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Git_Hub } from '../api.js';
function fetchIssues(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const githubRepo = new Git_Hub(repo, owner);
        let hasNextPage = true;
        let endCursor = null;
        let totalBugIssues = 0;
        let totalIssues = 0;
        let closedIssues = 0;
        let titles = [];
        while (hasNextPage) {
            const query = `
      query($owner: String!, $repo: String!, $after: String) {
        repository(owner: $owner, name: $repo) { 
          issues {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          bugIssues: issues(first: 5, labels: ["type: bug"], after: $after) {
            totalCount
            nodes {
              title
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    `;
            const variables = { owner, repo, after: endCursor };
            const result = yield githubRepo.getData(query, variables);
            console.log(result);
            totalIssues = result.repository.issues.totalCount;
            closedIssues = result.repository.closedIssues.totalCount;
            totalBugIssues += result.repository.bugIssues.totalCount;
            hasNextPage = result.repository.bugIssues.pageInfo.hasNextPage;
            endCursor = result.repository.bugIssues.pageInfo.endCursor;
            titles = result.repository.bugIssues.nodes.map((node) => node.title);
            console.log(titles);
        }
        return {
            totalCount: totalIssues,
            closedCount: closedIssues,
            bugCount: totalBugIssues,
            title: titles
        };
    });
}
function calculateLOC(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield githubRepo.getData(query, null);
        let totalLines = 0;
        function countLines(text) {
            return text.split('\n').length;
        }
        function traverseTree(entries) {
            if (!entries)
                return;
            entries.forEach((entry) => {
                if (entry.type === "blob" && entry.object && entry.object.text) {
                    totalLines += countLines(entry.object.text);
                }
                else if (entry.type === "tree" && entry.object && entry.object.entries) {
                    traverseTree(entry.object.entries);
                }
            });
        }
        if (result.repository.object && result.repository.object.entries) {
            traverseTree(result.repository.object.entries);
        }
        else {
            console.error("No entries found in the repository object.");
        }
        return totalLines;
    });
}
function calculateCorrectness(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const issuesData = yield fetchIssues(owner, repo);
        const totalLinesOfCode = yield calculateLOC(owner, repo);
        const totalIssues = issuesData.repository.issues.totalCount;
        const resolvedIssues = issuesData.repository.closedIssues.totalCount;
        const totalBugs = issuesData.repository.bugIssues.totalCount;
        const resolvedIssuesRatio = totalIssues > 0 ? resolvedIssues / totalIssues : 1;
        const normalizedBugRatio = totalLinesOfCode > 0 ? totalBugs / totalLinesOfCode : 0;
        const correctness = (0.7 * resolvedIssuesRatio) + (0.3 * (1 - normalizedBugRatio));
        console.log(`Correctness: ${correctness}`);
    });
}
export default calculateCorrectness;
calculateCorrectness("octokit", "graphql.js").catch(console.error);
