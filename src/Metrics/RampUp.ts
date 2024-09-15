import { graphql } from "@octokit/graphql";
import { Git_Hub } from "../api.js";

const query = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: ASC}) {
        edges {
          node {
            createdAt
            author {
              login
            }
          }
        }
      }
    }
  }
`;

async function calculateAverageTimeForFirstPR(owner: string, name: string): Promise<number> {
  const git_repo = new Git_Hub("graphql.js", "octokit");
  const data = await git_repo.getData(query, { owner, name });

  const pullRequests = data.repository.pullRequests.edges;

  if (pullRequests.length === 0) {
    return 0; // No pull requests found
  }

  const firstPRTimes: { [key: string]: number } = {};

  pullRequests.forEach((pr: any) => {
    const author = pr.node.author.login;
    const createdAt = new Date(pr.node.createdAt).getTime();

    if (!firstPRTimes[author]) {
      firstPRTimes[author] = createdAt;
    }
  });

  const firstPRDates = Object.values(firstPRTimes);
  const totalFirstPRTime = firstPRDates.reduce((acc, time) => acc + time, 0);
  const averageFirstPRTime = totalFirstPRTime / firstPRDates.length;

  return averageFirstPRTime;
}

// Example usage
(async () => {
    const owner = 'octokit'; // Replace with the repository owner
    const name = 'graphql.js'; // Replace with the repository name
  try {
    const averageTime = await calculateAverageTimeForFirstPR(owner, name);
    console.log(`Average time for first PR: ${averageTime} ms`);
  } catch (error) {
    console.error("Error calculating average time for first PR:", error);
  }
})();