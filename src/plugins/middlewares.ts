import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { asPlugin, logger } from '../lib/common';

export default asPlugin(async function (app) {
  app.use(
    pinoHttp({
      logger,
      customLogLevel(_, response, error) {
        if (response.statusCode >= 400 && response.statusCode < 500) {
          return 'warn';
        } else if (response.statusCode >= 500 || error) {
          return 'error';
        } else if (response.statusCode >= 300 && response.statusCode < 400) {
          return 'silent';
        }
        return 'info';
      },
      wrapSerializers: false,
    }),
    cors({ origin: '*' }),
    express.json({ strict: true }),
    express.urlencoded({ extended: true }),
  );
});
