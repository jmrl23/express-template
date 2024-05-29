import type { RequestHandler } from 'express';
import morgan from 'morgan';
import logger from '../lib/utils/logger';
import * as colorette from 'colorette';

export default (function morganMiddleware() {
  const format =
    ':remote-addr :method :url :status :res[content-length] - :response-time ms';

  return morgan(format, {
    stream: {
      write: (message) => {
        logger.http(colorette.gray(message.trim()));
      },
    },
  });
} satisfies RequestHandler);
