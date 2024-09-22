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
// import exp from "constants";
var api_1 = require("../api");
var query = "\n  query($owner: String!, $name: String!, $after: String) {\n    repository(owner: $owner, name: $name) {\n      pullRequests(first: 100, after: $after, orderBy: {field: CREATED_AT, direction: ASC}) {\n        edges {\n          node {\n            createdAt\n            author {\n              login\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  }\n";
function calculateAverageTimeForFirstPR(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var git_repo, hasNextPage, endCursor, firstPRTimes, data, pullRequests, firstPRDates, totalFirstPRTime, averageFirstPRTime, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git_repo = new api_1.GitHub(owner, name);
                    hasNextPage = true;
                    endCursor = null;
                    firstPRTimes = {};
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
                    pullRequests = data.data.repository.pullRequests.edges;
                    pullRequests.forEach(function (pr) {
                        var author = pr.node.author;
                        var createdAt = new Date(pr.node.createdAt).getTime();
                        if (author && author.login && !firstPRTimes[author.login]) {
                            firstPRTimes[author.login] = createdAt;
                        }
                    });
                    hasNextPage = data.data.repository.pullRequests.pageInfo.hasNextPage;
                    endCursor = data.data.repository.pullRequests.pageInfo.endCursor;
                    return [3 /*break*/, 2];
                case 4:
                    firstPRDates = Object.values(firstPRTimes);
                    totalFirstPRTime = firstPRDates.reduce(function (acc, time) { return acc + time; }, 0);
                    averageFirstPRTime = totalFirstPRTime / firstPRDates.length;
                    return [2 /*return*/, averageFirstPRTime];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching pull requests:", error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = calculateAverageTimeForFirstPR;
// // Example usage
// (async () => {
//   const owner = "octokit"; // Replace with the repository owner
//   const name = "graphql.js"; // Replace with the repository name
//   try {
//     const averageTime = await calculateAverageTimeForFirstPR(owner, name);
//     // console.log(`Average time for first PR: ${averageTime} ms`);
//   } catch (error) {
//     console.error("Error calculating average time for first PR:", error);
//   }
// })();
