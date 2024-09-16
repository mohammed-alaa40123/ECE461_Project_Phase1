var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GitHub } from '../api.js';
function fetchIssues(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const githubRepo = new GitHub(repo, owner);
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
        const result = yield githubRepo.getData(query, null);
        return result;
    });
}
function calculateLOC(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const githubRepo = new GitHub(repo, owner);
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
        if (result.data.repository.object && result.data.repository.object.entries) {
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
