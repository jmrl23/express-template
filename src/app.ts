import env from 'env-var';
import express from 'express';
import { corsMiddleware } from './middlewares/cors.middleware';
import { join } from 'node:path';
import { yellow } from 'colorette';
import { logger } from './lib/utils/logger';
import { morganMiddleware } from './middlewares/morgan.middleware';
import {
  errorHandler,
  registerControllers,
  vendors,
  wrapper,
} from '@jmrl23/express-helper';

export const app = express();

// configurations
app.disable('x-powered-by');

// middlewares
app.use(
  morganMiddleware(),
  corsMiddleware({
    origin: env.get('CORS_ORIGIN').default('*').asString(),
  }),
  express.json({
    strict: true,
  }),
  express.urlencoded({
    extended: true,
  }),
);

// public directory
app.use(express.static(join(__dirname, '../public')));

// controllers/ routes
const controllers = registerControllers(
  join(__dirname, './controllers'),
  '/',
  (controllers) => {
    for (const { filePath, controller } of controllers) {
      logger.info(
        `Controller ${yellow('Register')} {%s => %s}`,
        controller,
        filePath,
      );
    }
  },
);
app.use(controllers);

app.use(
  // 404 error
  wrapper((request) => {
    throw new vendors.httpErrors.NotFound(
      `Cannot ${request.method} ${request.path}`,
    );
  }),
  // custom error handler
  errorHandler((error, _request, _response, next) => {
    logger.error(error);
    next(error);
  }),
);
