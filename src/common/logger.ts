import { createLogger, format, transports } from 'winston';

const {
  combine,
  timestamp,
  printf,
  colorize,
  errors,
  splat,
  uncolorize,
  json,
} = format;

const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  colorize(),
  printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return ` ${timestamp} [${level}]: ${message}\nStack trace:\n${stack}`;
    }
    return ` ${timestamp} [${level}]: ${message}`;
  }),
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(
              timestamp(),
              errors({ stack: true }),
              splat(),
              uncolorize(),
              json(),
            ),
          }),
          new transports.File({
            filename: 'logs/combined.log',
            format: combine(
              timestamp(),
              errors({ stack: true }),
              splat(),
              uncolorize(),
              json(),
            ),
          }),
        ]
      : []),
  ],
});

export { logger };
