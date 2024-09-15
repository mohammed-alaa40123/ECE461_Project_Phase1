var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parentPort, workerData } from "worker_threads";
import calculateCorrectness from "./Metrics/Correctness.js";
import checkLicenseCompatibility from "./Metrics/Licensing.js";
function runFunction(fn, args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield fn(...args);
            parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage({ success: true, result });
        }
        catch (error) {
            parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage({
                success: false,
                error: error.message,
            });
        }
    });
}
const { functionName, args } = workerData;
if (functionName === "calculateCorrectness") {
    runFunction(calculateCorrectness, args);
}
else if (functionName === "checkLicenseCompatibility") {
    runFunction(checkLicenseCompatibility, args);
}
