import { createLogger, transports, format } from 'winston';

// Define the format we want to use
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize(),
  format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
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
            format: format.uncolorize()
          }),
          new transports.File({ 
            filename: 'logs/combined.log',
            format: format.uncolorize()
          })
        ] 
      : [])
  ]
});

export { logger };


