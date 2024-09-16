import { GitHub } from "../api.js";
import * as dotenv from "dotenv";

dotenv.config();

const compatibilityTable: { [key: string]: number } = {
  "LGPL-2.1": 1,
  MIT: 1,
  "GPL-3.0": 0,
  "Apache-2.0": 1,
  "BSD-3-Clause": 1,
  "BSD-2-Clause": 1,
  "MPL-2.0": 0.5,
  "AGPL-3.0": 0,
  "EPL-1.0": 0,
  "EPL-2.0": 0,
  "CC0-1.0": 1,
  Unlicense: 1,
  ISC: 1,
  Zlib: 1,
  "Artistic-2.0": 1,
  "OFL-1.1": 1,
  "EUPL-1.2": 0,
  "LGPL-3.0": 1,
  "GPL-2.0": 0,
  "GPL-2.0+": 0,
  "GPL-3.0+": 0,
  "AGPL-3.0+": 0,
  "LGPL-2.1+": 1,
  "LGPL-3.0+": 1,
  "Apache-1.1": 0,
  "Apache-1.0": 0,
  "CC-BY-4.0": 1,
  "CC-BY-SA-4.0": 0.5,
  "CC-BY-NC-4.0": 0,
  "CC-BY-ND-4.0": 0,
  "CC-BY-NC-SA-4.0": 0,
  "CC-BY-NC-ND-4.0": 0,
  // Add more licenses as needed
};

async function fetchLicenseInfo(owner: string, repo: string): Promise<any> {
  const githubRepo = new GitHub(repo, owner);
  const query = `
    query LicenseQuery($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        licenseInfo {
          name
          spdxId
        }
      }
    }
  `;

  const result = await githubRepo.getData(query, null);
  return result;
}

function rateLicense(licenseSpdxId: string): number {
  return compatibilityTable[licenseSpdxId] || 0;
}

async function checkLicenseCompatibility(owner: string, repo: string) {
  const licenseData = await fetchLicenseInfo(owner, repo);
  const licenseInfo = licenseData.data.repository.licenseInfo;

  if (!licenseInfo) {
    console.log("No license information found for this repository.");
    return;
  }

  const licenseSpdxId = licenseInfo.spdxId;
  const compatibilityScore = rateLicense(licenseSpdxId);

  // console.log(`License: ${licenseInfo.name}`);
  // console.log(`SPDX ID: ${licenseSpdxId}`);
  console.log(`Compatibility Score with LGPL v2.1: ${compatibilityScore}`);
}

checkLicenseCompatibility("octokit", "graphql.js").catch(console.error);

export default checkLicenseCompatibility;
