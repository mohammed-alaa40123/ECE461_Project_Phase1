import  calculateMetrics  from '../src/Metrics/Netscore.js';

describe('Netscore Module', () => {
  // Increase the default timeout for this test suite
  jest.setTimeout(300000); // Set timeout to 30 seconds

  it('should return a JSON object', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    console.log(parsedResult);
    expect(typeof parsedResult).toBe('object');
  });

  it('should contain a "URL" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('URL');
  });

  it('should contain a "NetScore" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('NetScore');
  });

  it('should contain a "NetScore_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('NetScore_Latency');
  });

  it('should contain a "RampUp" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('RampUp');
  });

  it('should contain a "RampUp_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('RampUp_Latency');
  });

  it('should contain a "Correctness" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('Correctness');
  });

  it('should contain a "Correctness_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('Correctness_Latency');
  });

  it('should contain a "BusFactor" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('BusFactor');
  });

  it('should contain a "BusFactor_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('BusFactor_Latency');
  });

  it('should contain a "ResponsiveMaintainer" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('ResponsiveMaintainer');
  });

  it('should contain a "ResponsiveMaintainer_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('ResponsiveMaintainer_Latency');
  });

  it('should contain a "License" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('License');
  });

  it('should contain a "License_Latency" property', async () => {
    const result = await calculateMetrics("octokit", "graphql.js");
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('License_Latency');
  });
});