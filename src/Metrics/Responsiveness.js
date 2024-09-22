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
var query = "\n  query($owner: String!, $name: String!, $after: String) {\n    repository(owner: $owner, name: $name) {\n      issues(first: 100, after: $after, states: CLOSED) {\n        edges {\n          node {\n            createdAt\n            comments(first: 1) {\n              edges {\n                node {\n                  createdAt\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  }\n";
function getIssueResponseTimes(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var git_repo, hasNextPage, endCursor, responseTimes, result, issues, totalResponseTime, averageResponseTime, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git_repo = new api_1.GitHub("graphql.js", "octokit");
                    hasNextPage = true;
                    endCursor = null;
                    responseTimes = [];
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
                    result = _a.sent();
                    issues = result.data.repository.issues.edges;
                    issues.forEach(function (issue) {
                        var createdAt = new Date(issue.node.createdAt);
                        var firstComment = issue.node.comments.edges[0];
                        if (firstComment) {
                            var firstResponseAt = new Date(firstComment.node.createdAt);
                            var responseTime = (firstResponseAt.getTime() - createdAt.getTime()) /
                                (1000 * 60 * 60); // in hours
                            responseTimes.push(responseTime);
                        }
                    });
                    hasNextPage = result.data.repository.issues.pageInfo.hasNextPage;
                    endCursor = result.data.repository.issues.pageInfo.endCursor;
                    return [3 /*break*/, 2];
                case 4:
                    responseTimes.sort(function (a, b) { return a - b; });
                    totalResponseTime = responseTimes.reduce(function (sum, time) { return sum + time; }, 0);
                    averageResponseTime = totalResponseTime / responseTimes.length;
                    return [2 /*return*/, averageResponseTime];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching data from GitHub API:", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = getIssueResponseTimes;
// // Example usage
// const owner: string = "octokit"; // Replace with the owner
// const name: string = "graphql.js"; // Replace with the repository name
// getIssueResponseTimes(owner, name);
