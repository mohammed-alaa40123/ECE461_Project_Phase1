import * as fs from 'fs';
import { Git_Hub, NPM } from '../api.js';
import calculateCorrectness  from '../Metrics/correctness.js';
import checkLicenseCompatibility from '../Metrics/Licensing.js';
export class URLFileCommand {
  public static async run(file: string): Promise<void> {
    console.log(`Processing URL file: ${file}`);
    fs.readFile(file, 'utf8', async (err, data) => {
      if (err) {
        console.error(`Error reading ${file}:`, err);
        process.exit(1);
        return;
      }


      const urls = data.split('\n').map(url => url.trim()).filter(url => url !== '');
    


      for (let url of urls) {
        if (url.includes('github.com')) {
          if (url.includes('%0D')) {
            url = url.replace('%0D', '');  // Remove the invalid character
          }
          if (url.includes('\r')) {
            url = url.replace('\r', '');  // Remove the invalid character
          }
    
          console.log(`GitHub package: ${url}`);
          const [owner, repo] = url.split('github.com/')[1].split('/');
          const githubRepo = new Git_Hub(repo, owner);
          const data = await githubRepo.getData("GET /repos/{owner}/{repo}");
          // console.log("GitHub Data:", data);
          calculateCorrectness(owner, repo).catch(console.error);
          checkLicenseCompatibility(owner, repo).catch(console.error);


        // } else if (url.includes('npmjs.com')) {
        //   console.log(`npm package: ${url}`);
        //   const packageName = url.split('package/')[1];
        //   const npmPackage = new NPM(packageName);
        //   const data = await npmPackage.getData();
        //   console.log("NPM Data:");
        //   const npmData = data as any;
        //   npmData.objects.forEach((obj: any) => {
        //     console.log(`Package Name: ${obj.package.name}`);
        //     console.log(`Version: ${obj.package.version}`);
        //     console.log(`Description: ${obj.package.description}`);
        //     console.log(`Score: ${obj.score.final}`);
        //     console.log('-----------------------------');
        //   });
        } else {
          console.log(`Unknown package source: ${url}`);
        }
      }
    });
  }
}