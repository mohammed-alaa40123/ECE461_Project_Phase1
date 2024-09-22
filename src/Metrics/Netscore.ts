import { timeWrapper } from "../timeWrapper.js";
import calculateCorrectness from "../Metrics/Correctness.js";
import { checkLicenseCompatibility } from "../Metrics/Licensing.js";
import calculateAverageTimeForFirstPR from "../Metrics/RampUp.js";
import { getIssueResponseTimes } from "../Metrics/Responsiveness.js";
import getCommitsByUser from "../Metrics/BusFactor.js";

// Wrap functions with timeWrapper
const wrappedCalculateCorrectness = timeWrapper(calculateCorrectness);
const wrappedCheckLicenseCompatibility = timeWrapper(checkLicenseCompatibility);
const wrappedCalculateAverageTimeForFirstPR = timeWrapper(
  calculateAverageTimeForFirstPR
);
const wrappedGetIssueResponseTimes = timeWrapper(getIssueResponseTimes);
const wrappedGetCommitsByUser = timeWrapper(getCommitsByUser);

async function calculateMetrics(owner: string, repo: string): Promise<any> {
  const correctness = await wrappedCalculateCorrectness(owner, repo);
  const licenseCompatibility = await wrappedCheckLicenseCompatibility(
    owner,
    repo
  );
  const rampUp = await wrappedCalculateAverageTimeForFirstPR(owner, repo);
  const responsiveness = await wrappedGetIssueResponseTimes(owner, repo);
  const busFactor = await wrappedGetCommitsByUser(owner, repo);
  const netscore =
    0.15 * busFactor.result +
    0.24 * correctness.result +
    0.15 * rampUp.result +
    0.2 * responsiveness.result +
    0.26 * licenseCompatibility.result;

  const url = `https://github.com/${owner}/${repo}`;

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
export default calculateMetrics;
