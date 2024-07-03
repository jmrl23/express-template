import * as c from 'colorette';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from '../lib/util/logger';
import { asPlugin } from '../lib/util/typings';

export default asPlugin(async function middleware(app) {
  app.use(
    morgan(
      ':remote-addr :method :url :status :res[content-length] - :response-time ms',
      {
        stream: {
          write(message) {
            logger.http(`${c.bold('morgan')} ${c.gray(message.trim())}`);
          },
        },
      },
    ),
    cors({
      origin: '*',
    }),
    express.json({
      strict: true,
    }),
    express.urlencoded({
      extended: true,
    }),
  );
});
