// import exp from "constants";
import { GitHub } from "../api.js";

const query = `
  query($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, after: $after, orderBy: {field: CREATED_AT, direction: ASC}) {
        edges {
          node {
            createdAt
            author {
              login
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
`;

async function calculateAverageTimeForFirstPR(
  owner: string,
  name: string
): Promise<number> {
  const git_repo = new GitHub(owner, name);

  let hasNextPage = true;
  let endCursor = null;
  const firstPRTimes: { [key: string]: number } = {};

  try {
    while (hasNextPage) {
      const data = await git_repo.getData(query, {
        owner,
        name,
        after: endCursor,
      });

      const pullRequests = data.data.repository.pullRequests.edges;

      pullRequests.forEach((pr: any) => {
        const author = pr.node.author;
        const createdAt = new Date(pr.node.createdAt).getTime();

        if (author && author.login && !firstPRTimes[author.login]) {
          firstPRTimes[author.login] = createdAt;
        }
      });

      hasNextPage = data.data.repository.pullRequests.pageInfo.hasNextPage;
      endCursor = data.data.repository.pullRequests.pageInfo.endCursor;
    }

    const firstPRDates = Object.values(firstPRTimes);
    const totalFirstPRTime = firstPRDates.reduce((acc, time) => acc + time, 0);
    const averageFirstPRTime = totalFirstPRTime / firstPRDates.length;

    return averageFirstPRTime;
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
}
export default  calculateAverageTimeForFirstPR;
// // Example usage
// (async () => {
//   const owner = "octokit"; // Replace with the repository owner
//   const name = "graphql.js"; // Replace with the repository name
//   try {
//     const averageTime = await calculateAverageTimeForFirstPR(owner, name);
//     // console.log(`Average time for first PR: ${averageTime} ms`);
//   } catch (error) {
//     console.error("Error calculating average time for first PR:", error);
//   }
// })();
