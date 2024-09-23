import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

// Define custom log levels
const customLevels = {
  levels: {
    silent: 0,
    info: 1,
    debug: 2,
  },
};

// Read environment variables
const logFile = process.env.LOG_FILE || 'application.log';
const logLevel: keyof typeof levelMap = process.env.LOG_LEVEL as keyof typeof levelMap || '0';

// Map log level to custom levels
const levelMap = {
  '0': 'silent',
  '1': 'info',
  '2': 'debug',
};

const logger: WinstonLogger = createLogger({
  levels: customLevels.levels,
  level: levelMap[logLevel] || 'silent',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFile })
  ]
});

export default logger;