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
var timeWrapper_1 = require("../timeWrapper");
var Correctness_1 = require("../Metrics/Correctness");
var Licensing_1 = require("../Metrics/Licensing");
var RampUp_1 = require("../Metrics/RampUp");
var Responsiveness_1 = require("../Metrics/Responsiveness");
var BusFactor_1 = require("../Metrics/BusFactor");
// Wrap functions with timeWrapper
var wrappedCalculateCorrectness = (0, timeWrapper_1.timeWrapper)(Correctness_1["default"]);
var wrappedCheckLicenseCompatibility = (0, timeWrapper_1.timeWrapper)(Licensing_1["default"]);
var wrappedCalculateAverageTimeForFirstPR = (0, timeWrapper_1.timeWrapper)(RampUp_1["default"]);
var wrappedGetIssueResponseTimes = (0, timeWrapper_1.timeWrapper)(Responsiveness_1["default"]);
var wrappedGetCommitsByUser = (0, timeWrapper_1.timeWrapper)(BusFactor_1["default"]);
function calculateMetrics(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var correctness, licenseCompatibility, rampUp, responsiveness, busFactor, netscore, url, ndjsonOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappedCalculateCorrectness(owner, repo)];
                case 1:
                    correctness = _a.sent();
                    return [4 /*yield*/, wrappedCheckLicenseCompatibility(owner, repo)];
                case 2:
                    licenseCompatibility = _a.sent();
                    return [4 /*yield*/, wrappedCalculateAverageTimeForFirstPR(owner, repo)];
                case 3:
                    rampUp = _a.sent();
                    return [4 /*yield*/, wrappedGetIssueResponseTimes(owner, repo)];
                case 4:
                    responsiveness = _a.sent();
                    return [4 /*yield*/, wrappedGetCommitsByUser(owner, repo)];
                case 5:
                    busFactor = _a.sent();
                    netscore = 0.15 * busFactor.result +
                        0.24 * correctness.result +
                        0.15 * rampUp.result +
                        0.2 * responsiveness.result +
                        0.26 * licenseCompatibility.result;
                    url = "https://github.com/".concat(owner, "/").concat(repo);
                    ndjsonOutput = {
                        URL: url,
                        NetScore: netscore,
                        NetScore_Latency: correctness.time + licenseCompatibility.time + rampUp.time + responsiveness.time + busFactor.time,
                        RampUp: rampUp.result,
                        RampUp_Latency: rampUp.time,
                        Correctness: correctness.result,
                        Correctness_Latency: correctness.time,
                        BusFactor: busFactor.result,
                        BusFactor_Latency: busFactor.time,
                        ResponsiveMaintainer: responsiveness.result,
                        ResponsiveMaintainer_Latency: responsiveness.time,
                        License: licenseCompatibility.result,
                        License_Latency: licenseCompatibility.time
                    };
                    return [2 /*return*/, (JSON.stringify(ndjsonOutput) + '\n')];
            }
        });
    });
}
exports["default"] = calculateMetrics;
// calculateMetrics("lodash","lodash")
// console.log(result);
