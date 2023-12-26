import { createLogger, transports as Transports, format as f } from 'winston';
import { gray, bold } from 'colorette';
import env from 'env-var';

export const format = f.combine(
  f.errors({ stack: true }),
  f((info) => ({ ...info, level: info.level.toUpperCase() }))(),
  f.colorize({ level: true }),
  f.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  f.prettyPrint(),
  f.splat(),
  f.printf(
    (info) =>
      `${gray(`[${info.timestamp}]`)} ${bold(info.level)} ${info.message}`,
  ),
);

export const level =
  env.get('NODE_ENV').default('development').asString() === 'development'
    ? 'debug'
    : 'info';

export const transports = [new Transports.Console()];

export const logger = createLogger({
  level,
  format,
  transports,
});

export default logger;
