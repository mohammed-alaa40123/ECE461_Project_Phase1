import { graphql } from "@octokit/graphql";

import * as dotenv from "dotenv";
dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

const GITHUB_TOKEN = env.GITHUB_TOKEN; 

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

interface LicenseData {
  repository: {
    licenseInfo: {
      name: string;
      spdxId: string;
    };
  };
}

const compatibilityTable: { [key: string]: number } = {
  "LGPL-2.1": 1,
  "MIT": 1,
  "GPL-3.0": 0,
  "Apache-2.0": 1,
  "BSD-3-Clause": 1,
  "BSD-2-Clause": 1,
  "MPL-2.0": 0.5,
  "AGPL-3.0": 0,
  "EPL-1.0": 0,
  "EPL-2.0": 0,
  "CC0-1.0": 1,
  "Unlicense": 1,
  "ISC": 1,
  "Zlib": 1,
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
};
async function fetchLicenseInfo(owner: string, repo: string): Promise<LicenseData> {
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

  const result: LicenseData = await graphqlWithAuth(query, {
    owner,
    repo,
  });

  return result;
}

function rateLicense(licenseSpdxId: string): number {
  return compatibilityTable[licenseSpdxId] || -1;
}

async function checkLicenseCompatibility(owner: string, repo: string) {
  const licenseData = await fetchLicenseInfo(owner, repo);
  const licenseInfo = licenseData.repository.licenseInfo;

  if (!licenseInfo) {
    console.log("No license information found for this repository.");
    return;
  }

  const licenseSpdxId = licenseData.repository.licenseInfo.spdxId;
  const compatibility = rateLicense(licenseSpdxId);

//   console.log(`License: ${licenseData.repository.licenseInfo.name}`);
//   console.log(`SPDX ID: ${licenseSpdxId}`);
  console.log(`Compatibility with LGPL v2.1: ${compatibility}`);
}


export default checkLicenseCompatibility;