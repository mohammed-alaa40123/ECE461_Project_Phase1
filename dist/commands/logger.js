import { createLogger, format, transports } from 'winston';
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
const logger = createLogger({
    levels: customLevels.levels,
    format: format.combine(format.timestamp(), format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'application.log' })
    ]
});
export default logger;
