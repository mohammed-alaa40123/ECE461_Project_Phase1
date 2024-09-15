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
const token = env.GITHUB_TOKEN;
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
const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function getCommitsByUser(owner, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = { authorization: `Bearer ${token}` };
        let hasNextPage = true;
        let endCursor = null;
        const userCommits = {};
        try {
            while (hasNextPage) {
                const data = yield graphql(query, {
                    owner,
                    name,
                    after: endCursor,
                    headers,
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
            console.log('Commits by user:');
            Object.entries(userCommits).forEach(([user, commits]) => {
                console.log(`${user}: ${commits} commits`);
            });
        }
        catch (error) {
            console.error('Error fetching data from GitHub API:', error);
        }
    });
}
const owner = 'octokit';
const name = 'graphql.js';
getCommitsByUser(owner, name);
