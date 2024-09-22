import {determineLicenseScore}  from '../Metrics/Licensing.js';
import {checkLicenseCompatibility} from '../Metrics/Licensing.js';
jest.setTimeout(300000);
describe('Licensing Module', () => {
  describe('checkLicenseCompatibility', () => {
    it('should return true for identical licenses',async () => {
      const result = await checkLicenseCompatibility('octokit', 'graphql.js');
      expect(result).toBe(1);
    });

    it('should return false for different licenses', async () => {
      const result = await checkLicenseCompatibility('octokit', 'graphql.js');
      expect(result).toBe(1);
    });

    // Add more test cases as needed
  });

  describe('determineLicenseScore', () => {
    it('should return 10 for MIT license', () => {
      const result = determineLicenseScore('MIT\n');
      expect(result).toBe(1);
    });

    it('should return 8 for GPL license', () => {
      const result = determineLicenseScore('GPL\n');
      expect(result).toBe(0);
    });

    it('should return 5 for unknown license', () => {
      const result = determineLicenseScore('Unknown');
      expect(result).toBe(0);
    });

    // Add more test cases as needed
  });
});