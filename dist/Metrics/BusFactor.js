var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Git_Hub } from "../api.js";
const query = `
  query($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after) {
              edges {
                node {
                  author {
                    user {
                      login
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    }
  }
`;
function getCommitsByUser(owner, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const git_repo = new Git_Hub("graphql.js", "octokit");
        let hasNextPage = true;
        let endCursor = null;
        const userCommits = {};
        try {
            while (hasNextPage) {
                const data = yield git_repo.getData(query, {
                    owner,
                    name,
                    after: endCursor,
                });
                const commits = data.repository.defaultBranchRef.target.history.edges;
                commits.forEach((commit) => {
                    var _a;
                    const author = (_a = commit.node.author.user) === null || _a === void 0 ? void 0 : _a.login;
                    if (author) {
                        if (!userCommits[author]) {
                            userCommits[author] = 0;
                        }
                        userCommits[author] += 1;
                    }
                });
                hasNextPage = data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage;
                endCursor = data.repository.defaultBranchRef.target.history.pageInfo.endCursor;
            }
            const commitnumbers = [];
            Object.entries(userCommits).forEach(([user, commits]) => {
                commitnumbers.push(commits);
            });
            commitnumbers.sort((a, b) => b - a);
            console.log('Sorted commit numbers:');
            commitnumbers.forEach((commits, index) => {
                console.log(`Commit ${index + 1}: ${commits}`);
            });
            var sum = 0;
            commitnumbers.forEach((commits, index) => {
                sum = sum + commits;
            });
            console.log('Total commits:', sum);
            var currentsum = 0;
            var busfactor = 0;
            for (const commits of commitnumbers) {
                currentsum += commits;
                busfactor += 1;
                if (currentsum > sum / 2) {
                    break;
                }
            }
            console.log('Bus factor:', busfactor);
        }
        catch (error) {
            console.error('Error fetching data from GitHub API:', error);
        }
    });
}
const owner = 'octokit';
const name = 'graphql.js';
getCommitsByUser(owner, name);
