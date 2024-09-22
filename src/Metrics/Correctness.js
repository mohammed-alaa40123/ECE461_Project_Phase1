"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import { resourceLimits } from 'worker_threads';
var api_1 = require("../api");
function fetchIssues(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var githubRepo, query, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    githubRepo = new api_1.GitHub(repo, owner);
                    query = "\n      query($owner: String!, $repo: String!) {\n        repository(owner: $owner, name: $repo) { \n          issues {\n            totalCount\n          }\n          closedIssues: issues(states: CLOSED) {\n            totalCount\n          }\n          bugIssues: issues(first: 5, labels: [\"type: bug\"]) {\n            totalCount\n          }\n        }\n      }\n    ";
                    return [4 /*yield*/, githubRepo.getData(query, null)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function calculateLOC(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        function countLines(text) {
            return text.split('\n').length;
        }
        function traverseTree(entries) {
            if (!entries)
                return;
            entries.forEach(function (entry) {
                if (entry.type === "blob" && entry.object && entry.object.text) {
                    totalLines += countLines(entry.object.text);
                }
                else if (entry.type === "tree" && entry.object && entry.object.entries) {
                    traverseTree(entry.object.entries); // Recursively traverse subdirectories
                }
            });
        }
        var githubRepo, query, result, totalLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    githubRepo = new api_1.GitHub(repo, owner);
                    query = "{\n    repository(owner: \"".concat(owner, "\", name: \"").concat(repo, "\") {\n      object(expression: \"HEAD:\") {\n        ... on Tree {\n          entries {\n            name\n            type\n            object {\n              ... on Blob {\n                text\n              }\n              ... on Tree {\n                entries {\n                  name\n                  type\n                  object {\n                    ... on Blob {\n                      text\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }");
                    return [4 /*yield*/, githubRepo.getData(query, null)];
                case 1:
                    result = _a.sent();
                    totalLines = 0;
                    if (result.data.repository.object && result.data.repository.object.entries) {
                        traverseTree(result.data.repository.object.entries);
                    }
                    else {
                        console.error("No entries found in the repository object.");
                    }
                    return [2 /*return*/, totalLines];
            }
        });
    });
}
function calculateCorrectness(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var issuesData, totalLinesOfCode, totalIssues, resolvedIssues, totalBugs, resolvedIssuesRatio, normalizedBugRatio, correctness;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchIssues(owner, repo)];
                case 1:
                    issuesData = _a.sent();
                    return [4 /*yield*/, calculateLOC(owner, repo)];
                case 2:
                    totalLinesOfCode = _a.sent();
                    totalIssues = issuesData.data.repository.issues.totalCount;
                    resolvedIssues = issuesData.data.repository.closedIssues.totalCount;
                    totalBugs = issuesData.data.repository.bugIssues.totalCount;
                    resolvedIssuesRatio = totalIssues > 0 ? resolvedIssues / totalIssues : 1;
                    normalizedBugRatio = totalLinesOfCode > 0 ? totalBugs / totalLinesOfCode : 0;
                    correctness = (0.7 * resolvedIssuesRatio) + (0.3 * (1 - normalizedBugRatio));
                    // console.log(`Total Issues: ${totalIssues}`);
                    // console.log(`Resolved Issues: ${resolvedIssues}`);
                    // console.log(`Total Bugs: ${totalBugs}`);
                    // console.log(`Total Lines of Code: ${totalLinesOfCode}`);
                    // console.log(`Correctness: ${correctness}`);
                    return [2 /*return*/, correctness];
            }
        });
    });
}
exports["default"] = calculateCorrectness;
// calculateCorrectness("lodash", "lodash").catch(console.error);
