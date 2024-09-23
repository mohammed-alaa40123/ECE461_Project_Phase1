import {calculateMetrics} from '../Metrics/Netscore.js';

describe('Netscore Module', () => {
  // Increase the default timeout for this test suite
  jest.setTimeout(300000); // Set timeout to 5 minutes
  let result: any;
  beforeAll(async () => { result = await calculateMetrics("octokit", "graphql.js") });

  it('should return a JSON object', async () => {
    // console.log(result);
    expect(typeof result).toBe('object');
  });

  it('should contain a "URL" property', async () => {
    expect(result).toHaveProperty('URL');
  });

  it('should contain a "NetScore" property', async () => {
    expect(result).toHaveProperty('NetScore');
  });

  it('should contain a "NetScore_Latency" property', async () => {
    expect(result).toHaveProperty('NetScore_Latency');
  });

  it('should contain a "RampUp" property', async () => {
    expect(result).toHaveProperty('RampUp');
  });

  it('should contain a "RampUp_Latency" property', async () => {
    expect(result).toHaveProperty('RampUp_Latency');
  });

  it('should contain a "Correctness" property', async () => {
    expect(result).toHaveProperty('Correctness');
  });

  it('should contain a "Correctness_Latency" property', async () => {
    expect(result).toHaveProperty('Correctness_Latency');
  });

  it('should contain a "BusFactor" property', async () => {
    expect(result).toHaveProperty('BusFactor');
  });

  it('should contain a "BusFactor_Latency" property', async () => {
    expect(result).toHaveProperty('BusFactor_Latency');
  });

  it('should contain a "ResponsiveMaintainer" property', async () => {
    expect(result).toHaveProperty('ResponsiveMaintainer');
  });

  it('should contain a "ResponsiveMaintainer_Latency" property', async () => {
    expect(result).toHaveProperty('ResponsiveMaintainer_Latency');
  });

  it('should contain a "License" property', async () => {
    expect(result).toHaveProperty('License');
  });

  it('should contain a "License_Latency" property', async () => {
    expect(result).toHaveProperty('License_Latency');
  });
});