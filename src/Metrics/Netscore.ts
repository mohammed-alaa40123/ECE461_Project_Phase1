import { MetricCalculatorFactory } from '../Metrics/MetricCalculator.js';

async function calculateMetrics(ownerOrPackage: string, repo?: string): Promise<any> {
    const calculator = MetricCalculatorFactory.create(repo);
    const correctness = await calculator.calculateCorrectness(ownerOrPackage, repo);
    const licenseCompatibility = await calculator.calculateLicenseCompatibility(ownerOrPackage, repo);
    const rampUp = await calculator.calculateRampUp(ownerOrPackage, repo);
    const responsiveness = await calculator.calculateResponsiveness(ownerOrPackage, repo);
    const busFactor = await calculator.calculateBusFactor(ownerOrPackage, repo);

    const netscore =
        0.15 * busFactor.result +
        0.24 * correctness.result +
        0.15 * rampUp.result +
        0.2 * responsiveness.result +
        0.26 * licenseCompatibility.result;

    const url = calculator.getUrl(ownerOrPackage, repo);

    const ndjsonOutput = {
        URL: url,
        NetScore: netscore,
        NetScore_Latency:
            correctness.time +
            licenseCompatibility.time +
            rampUp.time +
            responsiveness.time +
            busFactor.time,
        RampUp: rampUp.result,
        RampUp_Latency: rampUp.time,
        Correctness: correctness.result,
        Correctness_Latency: correctness.time,
        BusFactor: busFactor.result,
        BusFactor_Latency: busFactor.time,
        ResponsiveMaintainer: responsiveness.result,
        ResponsiveMaintainer_Latency: responsiveness.time,
        License: licenseCompatibility.result,
        License_Latency: licenseCompatibility.time,

    };

    return ndjsonOutput;
}

export { calculateMetrics };