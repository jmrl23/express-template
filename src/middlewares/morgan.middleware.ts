import morgan from 'morgan';
import { gray } from 'colorette';
import { logger } from '../lib/utils/logger';

export const morganMiddleware = function morganMiddleware() {
  const format =
    ':remote-addr :method :url :status :res[content-length] - :response-time ms';

  return morgan(format, {
    stream: {
      write: (message) => {
        logger.http(gray(message.trim()));
      },
    },
  });
};
