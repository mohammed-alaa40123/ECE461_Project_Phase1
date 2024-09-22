import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';

const git = simpleGit();

async function cloneRepository(url: string, dir: string) {
    // Ensure the directory is empty
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true });
    }
    fs.mkdirSync(dir, { recursive: true });

    // Clone the repository
    await git.clone(url, dir, ['--depth', '1']);
}

async function getCommitHistory(dir: string) {
    const log = await git.cwd(dir).log();
    return log.all;
}

function calculateBusFactor(commits: any[]) {
    const authorCommitCount: { [author: string]: number } = {};
    commits.forEach(commit => {
        const author = commit.author_name;
        if (!authorCommitCount[author]) {
            authorCommitCount[author] = 0;
        }
        authorCommitCount[author]++;
    });

    const sortedAuthors = Object.values(authorCommitCount).sort((a, b) => b - a);
    const totalCommits = commits.length;
    let cumulativeCommits = 0;
    let busFactor = 0;

    for (const commitCount of sortedAuthors) {
        cumulativeCommits += commitCount;
        busFactor++;
        if (cumulativeCommits / totalCommits > 0.5) {
            break;
        }
    }

    return busFactor;
}

async function getIssueResponseTimes(owner: string, repo: string): Promise<number> {
    const dir = path.join('/tmp', repo);

    // Clone the repository
    await cloneRepository(`https://github.com/${owner}/${repo}.git`, dir);

    // Parse issues and comments from the cloned repository
    const issuesDir = path.join(dir, '.git', 'issues');
    const responseTimes: number[] = [];

    if (fs.existsSync(issuesDir)) {
        const issueFiles = fs.readdirSync(issuesDir);

        issueFiles.forEach(issueFile => {
            const issuePath = path.join(issuesDir, issueFile);
            const issueData = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
            const createdAt = new Date(issueData.created_at);

            if (issueData.comments && issueData.comments.length > 0) {
                const firstComment = issueData.comments[0];
                const firstResponseAt = new Date(firstComment.created_at);
                const responseTime = (firstResponseAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // in hours
                responseTimes.push(responseTime);
            }
        });

        responseTimes.sort((a, b) => a - b);

        const totalResponseTime = responseTimes.reduce((sum, time) => sum + time, 0);
        const averageResponseTime = totalResponseTime / responseTimes.length;

        return averageResponseTime;
    } else {
        throw new Error('Issues directory not found in the cloned repository.');
    }
}

export { cloneRepository, getCommitHistory, calculateBusFactor, getIssueResponseTimes };

// async function main() {
//     const url = 'https://github.com/octokit/graphql.js.git';
//     const dir = '/tmp/graphql.js';

//     await cloneRepository(url, dir);
//     const commits = await getCommitHistory(dir);
//     const busFactor = calculateBusFactor(commits);

//     console.log(`Bus Factor: ${busFactor}`);

//     const owner = 'octokit';
//     const repo = 'graphql.js';
//     const averageResponseTime = await getIssueResponseTimes(owner, repo);
//     console.log(`Average Response Time: ${averageResponseTime} hours`);
// }

// main();