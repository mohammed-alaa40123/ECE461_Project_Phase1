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
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeWrapper = timeWrapper;
function timeWrapper(fn) {
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = process.hrtime();
            try {
                const result = yield fn(...args);
                const end = process.hrtime(start);
                const time = end[0] + end[1] / 1e9; // Convert to seconds
                const roundedTime = Math.round(time * 1000) / 1000; // Round to three decimal places
                return { result, time: roundedTime };
            }
            catch (error) {
                const end = process.hrtime(start);
                const time = end[0] + end[1] / 1e9; // Convert to seconds
                const roundedTime = Math.round(time * 1000) / 1000; // Round to three decimal places
                throw { error, time: roundedTime };
            }
        });
    };
}
