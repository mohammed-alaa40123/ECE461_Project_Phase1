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
const GITHUB_TOKEN = env.GITHUB_TOKEN;
const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `Bearer ${GITHUB_TOKEN}`,
    },
});
function fetchIssues(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield graphqlWithAuth(query, {
            owner,
            repo,
        });
        return result;
    });
}
function calculateLOC(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield graphqlWithAuth(query, { owner, repo });
        let totalLines = 0;
        function countLines(text) {
            return text.split('\n').length;
        }
        function traverseTree(entries) {
            if (!entries)
                return;
            entries.forEach((entry) => {
                if (entry.type === "blob" && entry.object.text) {
                    totalLines += countLines(entry.object.text);
                }
                else if (entry.type === "tree") {
                    traverseTree(entry.object.entries);
                }
            });
        }
        traverseTree(result.repository.object.entries);
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
        const correctness = ((resolvedIssues / totalIssues) +
            (totalBugs / totalLinesOfCode)) / 2;
        console.log(`Correctness: ${correctness}`);
    });
}
export default calculateCorrectness;
