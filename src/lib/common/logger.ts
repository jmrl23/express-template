import { Request, Response } from 'express';
import pino, { Logger } from 'pino';
import 'pino-pretty';

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
    serializers: {
      req(request: Request) {
        return {
          method: request.method,
          url: request.url,
          params: request.params,
          query: request.query,
        };
      },
      res(response: Response) {
        return {
          statusCode: response.statusCode,
          headers: response.getHeaders(),
        };
      },
    },
  }),
);

const logger = loggers.get(process.env.NODE_ENV) ?? pino();

export default logger;
