import { getIssueResponseTimes } from '../src/Metrics/Responsiveness';

describe('Responsiveness Metrics', () => {
  it('should calculate issue response times', async () => {
    const owner = 'octokit';
    const name = 'graphql.js';

    // Mock console.log to avoid logging during tests
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await getIssueResponseTimes(owner, name);

    // Verify that console.log was called with the expected output
    expect(consoleLogSpy).toHaveBeenCalledWith('Responsiveness (in hours):', expect.any(Number));

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});