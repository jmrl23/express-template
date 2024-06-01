import { createLogger, transports as Transports, format } from 'winston';
import * as colorette from 'colorette';
import env from 'env-var';

const loggerFormat = format.combine(
  format.errors({ stack: true }),
  format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
  format.colorize({ level: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.prettyPrint(),
  format.splat(),
  format.printf(
    (info) =>
      `${colorette.gray(`[${info.timestamp}]`)} ${colorette.bold(info.level)} ${info.message}`,
  ),
);

const level =
  env.get('NODE_ENV').default('development').asString() === 'development'
    ? 'debug'
    : 'info';

const transports = [new Transports.Console()];

const logger = createLogger({
  level,
  format: loggerFormat,
  transports,
});

export default logger;
