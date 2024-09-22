"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Define custom log levels
const customLevels = {
    levels: {
        startup: 0,
        error: 1,
        warn: 2,
        dataChange: 3,
        request: 4,
        stateChange: 5,
        userInteraction: 6,
        risk: 7,
        wait: 8,
        progress: 9,
        branch: 10,
        summary: 11,
        info: 12,
        debug: 13
    },
};
const logger = (0, winston_1.createLogger)({
    levels: customLevels.levels,
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'application.log' })
    ]
});
exports.default = logger;
