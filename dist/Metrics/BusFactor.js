var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GitHub, NPM } from "../api.js";
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
        const git_repo = new GitHub("graphql.js", "octokit");
        let hasNextPage = true;
        let endCursor = null;
        const userCommits = {};
        var busfactor = 0;
        try {
            while (hasNextPage) {
                const data = yield git_repo.getData(query, {
                    owner,
                    name,
                    after: endCursor,
                });
                const commits = data.data.repository.defaultBranchRef.target.history.edges;
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
                hasNextPage =
                    data.data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage;
                endCursor =
                    data.data.repository.defaultBranchRef.target.history.pageInfo.endCursor;
            }
            const commitnumbers = [];
            Object.entries(userCommits).forEach((commits) => {
                commitnumbers.push(commits[1]);
            });
            commitnumbers.sort((a, b) => b - a);
            var sum = 0;
            commitnumbers.forEach((commits) => {
                sum = sum + commits;
            });
            var currentsum = 0;
            for (const commits of commitnumbers) {
                currentsum += commits;
                busfactor += 1;
                if (currentsum > sum / 2) {
                    break;
                }
            }
        }
        catch (error) {
            console.error("Error fetching data from GitHub API:", error);
        }
        return busfactor;
    });
}
export default getCommitsByUser;
export function getNpmCommitsbyUser(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const npm_repo = new NPM(packageName);
        var owner = "";
        var name = "";
        try {
            const response = yield npm_repo.getData();
            if (response) {
                const response_splitted = response.split("/");
                owner = response.split("/")[response_splitted.length - 2];
                name = response
                    .split("/")[response_splitted.length - 1].split(".")[0];
            }
        }
        catch (error) {
            console.error(`Error fetching package info for ${packageName}:`, error);
        }
        var busFactor = yield getCommitsByUser(owner, name);
        return busFactor;
    });
}
const owner = "facebook";
const name = "react";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const busFactor = yield getCommitsByUser(owner, name);
    console.log(busFactor);
    const npmBusFactor = yield getNpmCommitsbyUser(name);
    console.log(npmBusFactor);
}))();
