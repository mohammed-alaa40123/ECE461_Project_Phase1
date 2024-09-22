// import exp from "constants";
import { NPM,GitHub } from "../api.js";

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

export async function getNpmRampUp(packageName: string): Promise<Number> {
  const npm_repo = new NPM(packageName);
  var owner:string="";
  var name:string="";
  try {
    const response = await npm_repo.getData();
    if (response) {
      const response_splitted = response.split("/");
      owner = response.split("/")[response_splitted.length - 2];
      
       name = response
        .split("/")
        [response_splitted.length - 1].split(".")[0];
        

    }
  } catch (error) {
    console.error(`Error fetching package info for ${packageName}:`, error);
  }
  var busFactor:number = await calculateAverageTimeForFirstPR(owner, name);
  return busFactor;
}
// // Example usage
 const owner = "facebook"; // Replace with the repository owner
 const name = "react"; // Replace with the repository name

 //console.log(getNpmCommitsbyUser(name));
 (async () => {
  const busFactor = await calculateAverageTimeForFirstPR(owner, name);
  console.log(busFactor);
   const npmBusFactor = await getNpmRampUp(name);
   console.log(npmBusFactor);
})();
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
