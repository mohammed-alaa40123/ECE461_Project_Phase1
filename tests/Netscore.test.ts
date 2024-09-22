import calculateMetrics from '../src/Metrics/Netscore';

describe('Netscore Module', () => {
  describe('calculateMetrics', () => {
    // Increase the default timeout for this test suite
    jest.setTimeout(300000); // Set timeout to 30 seconds

   
    it('should return a JSON object', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(typeof result).toBe('object');
    });

    it('should contain a "URL" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('URL');
    });

    it('should contain a "NetScore" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('NetScore');
    });

    it('should contain a "NetScore_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('NetScore_Latency');
    });

    it('should contain a "RampUp" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('RampUp');
    });

    it('should contain a "RampUp_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('RampUp_Latency');
    });

    it('should contain a "Correctness" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('Correctness');
    });

    it('should contain a "Correctness_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('Correctness_Latency');
    });

    it('should contain a "BusFactor" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('BusFactor');
    });

    it('should contain a "BusFactor_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('BusFactor_Latency');
    });

    it('should contain a "ResponsiveMaintainer" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('ResponsiveMaintainer');
    });

    it('should contain a "ResponsiveMaintainer_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('ResponsiveMaintainer_Latency');
    });

    it('should contain a "License" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('License');
    });

    it('should contain a "License_Latency" property', async () => {
      const result = await calculateMetrics("octokit", "graphql.js");
      expect(result).toHaveProperty('License_Latency');
    });

    it('should handle invalid repository names gracefully', async () => {
      await expect(calculateMetrics("octokit", "invalid-repo")).rejects.toThrow();
    });

    it('should handle invalid owner names gracefully', async () => {
      await expect(calculateMetrics("invalid-owner", "graphql.js")).rejects.toThrow();
    });


  });
});