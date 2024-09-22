import  calculateLOC  from '../Metrics/Correctness';
import  calculateCorrectness  from '../Metrics/Correctness';

describe('Correctness Module', () => {
  describe('calculateLOC', () => {
    it('should correctly calculate lines of code', async () => {
      const result = await calculateLOC("octokit", "graphql.js");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100000); // Assuming a reasonable upper limit for lines of code
    });
  });

  describe('calculateCorrectness', () => {
    it('should correctly calculate correctness score', async () => {
      const result = await calculateCorrectness("octokit", "graphql.js");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});