import { createLogger, transports, format, error, warn } from 'winston';

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});
const logger = createLogger({
  level: 'info',
  format: format.cli({
    colors: {
      info: 'green',
      error: 'red',
      warn: 'yellow',
    },
    all: true,
  }),

  transports: [new transports.Console()],
});

export { logger };
