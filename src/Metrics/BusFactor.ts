import { GitHub } from "../api.js";
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

async function getCommitsByUser(owner: string, name: string) {
  const git_repo = new GitHub("graphql.js", "octokit");

  let hasNextPage = true;
  let endCursor = null;
  const userCommits: { [key: string]: number } = {};

  try {
    while (hasNextPage) {
      const data = await git_repo.getData(query, {
        owner,
        name,
        after: endCursor,
      });

      const commits = data.data.repository.defaultBranchRef.target.history.edges;

      commits.forEach((commit: any) => {
        const author = commit.node.author.user?.login;
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
    const commitnumbers: number[] = [];

    Object.entries(userCommits).forEach((commits) => {
      commitnumbers.push(commits[1]);
    });
    commitnumbers.sort((a, b) => b - a);
    console.log("Sorted commit numbers:");
    commitnumbers.forEach((commits, index) => {
      console.log(`Commit ${index + 1}: ${commits}`);
    });
    var sum: number = 0;
    commitnumbers.forEach((commits) => {
      sum = sum + commits;
    });
    console.log("Total commits:", sum);
    var currentsum: number = 0;
    var busfactor: number = 0;
    for (const commits of commitnumbers) {
      currentsum += commits;
      busfactor += 1;
      if (currentsum > sum / 2) {
        break;
      }
    }
    console.log("Bus factor:", busfactor);
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
  }
}

// Example usage
const owner = "octokit"; // Replace with the repository owner
const name = "graphql.js"; // Replace with the repository name
getCommitsByUser(owner, name);
