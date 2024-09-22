import  getCommitsByUser  from '../Metrics/BusFactor';


describe('BusFactor Module', () => {
  describe('getCommitsByUser', () => {
    it('should calculate commits per user ,and sort them then output the number of critical users', async () => {
      const result = await getCommitsByUser("octokit", "graphql.js");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100000); // Assuming a reasonable upper limit for lines of code
    });
  });


});