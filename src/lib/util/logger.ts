import { createLogger, transports as Transports, format } from 'winston';
import type { LoggerOptions } from 'winston';
import * as c from 'colorette';

const options = new Map<NODE_ENV_VALUE, LoggerOptions>();

options.set('development', {
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.splat(),
    format.colorize({ level: true }),
    format.prettyPrint(),
    format.printf(
      ({ timestamp, level, message }) =>
        `${c.gray(`[${timestamp}]`)} ${c.bold(level.padEnd(5))} ${message}`,
    ),
  ),
  transports: [new Transports.Console()],
});

options.set('production', {
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.uncolorize(),
    format.json(),
  ),
  transports: [new Transports.Console()],
});

const logger = createLogger(
  options.get(process.env.NODE_ENV as NODE_ENV_VALUE),
);

export default logger;
