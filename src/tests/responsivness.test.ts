import { getIssueResponseTimes } from "../Metrics/Responsiveness.js";

describe("Responsiveness Metrics", () => {
  it("should calculate issue response times", async () => {
    const owner = "octokit";
    const name = "graphql.js";

    const averageResponseTime = await getIssueResponseTimes(owner, name);

    // Verify that the average response time is a number
    expect(typeof averageResponseTime).toBe("number");
  });
});
