import { graphql } from "@octokit/graphql";

import * as dotenv from "dotenv";
dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

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
async function getCommitsByUser(owner: string, name: string) {
  const headers = { authorization: `Bearer ${token}` };

  let hasNextPage = true;
  let endCursor = null;
  const userCommits: { [key: string]: number } = {};

  try {
    while (hasNextPage) {
      const data:any = await graphql(query, {
        owner,
        name,
        after: endCursor,
        headers,
      });

      const commits = data.repository.defaultBranchRef.target.history.edges;

      commits.forEach((commit: any) => {
        const author = commit.node.author.user?.login;
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
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
  }
}

// Example usage
const owner = 'octokit'; // Replace with the repository owner
const name = 'graphql.js'; // Replace with the repository name
getCommitsByUser(owner, name);
