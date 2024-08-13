import pino, { Logger } from 'pino';

const loggers = new Map<NodeEnv, Logger>();

loggers.set(
  'development',
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      },
    },
  }),
);

const logger = loggers.get(process.env.NODE_ENV) ?? pino();

export default logger;
