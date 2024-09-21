import { GitHub } from "../api.js";

const query = `
  query($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      issues(first: 100, after: $after, states: CLOSED) {
        edges {
          node {
            createdAt
            comments(first: 1) {
              edges {
                node {
                  createdAt
                }
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
`;

interface Issue {
  node: {
    createdAt: string;
    comments: {
      edges: {
        node: {
          createdAt: string;
        };
      }[];
    };
  };
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface QueryResponse {
  data: {
    repository: {
      issues: {
        edges: Issue[];
        pageInfo: PageInfo;
      };
    };
  };
}

async function getIssueResponseTimes(
  owner: string,
  name: string
): Promise<any> {
  const git_repo = new GitHub("graphql.js", "octokit");

  let hasNextPage: boolean = true;
  let endCursor: string | null = null;
  const responseTimes: number[] = [];

  try {
    while (hasNextPage) {
      const result: QueryResponse = await git_repo.getData(query, {
        owner,
        name,
        after: endCursor,
      });

      const issues: Issue[] = result.data.repository.issues.edges;

      issues.forEach((issue: Issue) => {
        const createdAt: Date = new Date(issue.node.createdAt);
        const firstComment = issue.node.comments.edges[0];
        if (firstComment) {
          const firstResponseAt: Date = new Date(firstComment.node.createdAt);
          const responseTime: number =
            (firstResponseAt.getTime() - createdAt.getTime()) /
            (1000 * 60 * 60); // in hours
          responseTimes.push(responseTime);
        }
      });

      hasNextPage = result.data.repository.issues.pageInfo.hasNextPage;
      endCursor = result.data.repository.issues.pageInfo.endCursor;
    }

    responseTimes.sort((a, b) => a - b);
    // console.log("Sorted response times (in hours):");
    // responseTimes.forEach((time, index) => {
    //   console.log(`Response Time ${index + 1}: ${time}`);
    // });

    const totalResponseTime: number = responseTimes.reduce(
      (sum, time) => sum + time,
      0
    );
    const averageResponseTime: number =
      totalResponseTime / responseTimes.length;
      return averageResponseTime;
    // console.log("Responsiveness (in hours):", averageResponseTime);
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
  }
}

export default getIssueResponseTimes;

// Example usage
const owner: string = "octokit"; // Replace with the owner
const name: string = "graphql.js"; // Replace with the repository name
getIssueResponseTimes(owner, name);
