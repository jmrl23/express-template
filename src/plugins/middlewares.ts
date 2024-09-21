import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { asPlugin, logger } from '../lib/common';
import { CORS_ORIGIN } from '../lib/constant/env';

export default asPlugin(async function (app) {
  app.use(
    pinoHttp({
      logger,
      wrapSerializers: false,
    }),
  );

  app.use(
    cors({ origin: CORS_ORIGIN }),
    express.json({ strict: true }),
    express.urlencoded({ extended: true }),
  );
});
