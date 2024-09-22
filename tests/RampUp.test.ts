import  calculateAverageTimeForFirstPR  from '../src/Metrics/RampUp';


describe('Ramp Up Module', () => {
    describe('calculateAverageTimeForFirstPR', () => {
      it('should calculate time until first PR', async () => {
        const result = await calculateAverageTimeForFirstPR("octokit", "graphql.js");
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10000000000000000); // Assuming a reasonable upper limit for lines of code
      });
    });


  });