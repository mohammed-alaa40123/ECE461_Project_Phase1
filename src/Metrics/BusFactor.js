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
var api_1 = require("../api");
var query = "\n  query($owner: String!, $name: String!, $after: String) {\n    repository(owner: $owner, name: $name) {\n      defaultBranchRef {\n        target {\n          ... on Commit {\n            history(first: 100, after: $after) {\n              edges {\n                node {\n                  author {\n                    user {\n                      login\n                    }\n                  }\n                }\n              }\n              pageInfo {\n                hasNextPage\n                endCursor\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n";
function getCommitsByUser(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var git_repo, hasNextPage, endCursor, userCommits, busfactor, data, commits, commitnumbers_2, sum, currentsum, _i, commitnumbers_1, commits, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git_repo = new api_1.GitHub("graphql.js", "octokit");
                    hasNextPage = true;
                    endCursor = null;
                    userCommits = {};
                    busfactor = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    _a.label = 2;
                case 2:
                    if (!hasNextPage) return [3 /*break*/, 4];
                    return [4 /*yield*/, git_repo.getData(query, {
                            owner: owner,
                            name: name,
                            after: endCursor
                        })];
                case 3:
                    data = _a.sent();
                    commits = data.data.repository.defaultBranchRef.target.history.edges;
                    commits.forEach(function (commit) {
                        var _a;
                        var author = (_a = commit.node.author.user) === null || _a === void 0 ? void 0 : _a.login;
                        if (author) {
                            if (!userCommits[author]) {
                                userCommits[author] = 0;
                            }
                            userCommits[author] += 1;
                        }
                    });
                    hasNextPage =
                        data.data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage;
                    endCursor =
                        data.data.repository.defaultBranchRef.target.history.pageInfo.endCursor;
                    return [3 /*break*/, 2];
                case 4:
                    commitnumbers_2 = [];
                    Object.entries(userCommits).forEach(function (commits) {
                        commitnumbers_2.push(commits[1]);
                    });
                    commitnumbers_2.sort(function (a, b) { return b - a; });
                    sum = 0;
                    commitnumbers_2.forEach(function (commits) {
                        sum = sum + commits;
                    });
                    currentsum = 0;
                    for (_i = 0, commitnumbers_1 = commitnumbers_2; _i < commitnumbers_1.length; _i++) {
                        commits = commitnumbers_1[_i];
                        currentsum += commits;
                        busfactor += 1;
                        if (currentsum > sum / 2) {
                            break;
                        }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching data from GitHub API:", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, busfactor];
            }
        });
    });
}
exports["default"] = getCommitsByUser;
// // Example usage
// const owner = "octokit"; // Replace with the repository owner
// const name = "graphql.js"; // Replace with the repository name
// getCommitsByUser(owner, name);
