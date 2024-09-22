import * as fs from "fs";
import calculateMetrics from "../Metrics/Netscore.js";
export class URLFileCommand {
  public static async run(file: string): Promise<void> {
    console.log(`Processing URL file: ${file}`);
    fs.readFile(file, "utf8", async (err, data) => {
      if (err) {
        console.error(`Error reading ${file}:`, err);
        process.exit(1);
        return;
      }

      const urls = data
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url !== "");



      for (let url of urls) {
        if (url.includes("github.com")) {
          console.log(`GitHub package: ${url}`);
          const [owner, repo] = url.split("github.com/")[1].split("/");

          const result = await  calculateMetrics(owner, repo);
          console.log(result);
        }























        else if (url.includes("npmjs.com")) {
          console.log(`npm package: ${url}`);
          // const packageName = url.split('package/')[1];

          // try {
          //   const correctnessResult = await wrappedCalculateCorrectness(packageName);
          //   console.log(`calculateCorrectness result: ${correctnessResult}`);
          // } catch (error) {
          //   console.error(`Error in calculateCorrectness for ${url}:`, error);
          // }

          // try {
          //   const licenseResult = await wrappedCheckLicenseCompatibility(packageName);
          //   console.log(`checkLicenseCompatibility result: ${licenseResult}`);
          // } catch (error) {
          //   console.error(`Error in checkLicenseCompatibility for ${url}:`, error);
          // }
        } else {
          console.log(`Unknown package source: ${url}`);
        }
      }
    });
  }
}
