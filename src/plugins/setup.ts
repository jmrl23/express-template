/**
 * Main entry point for plugins
 */
import * as c from 'colorette';
import type { Application, ErrorRequestHandler } from 'express';
import express from 'express';
import createHttpError, {
  HttpError,
  InternalServerError,
  NotFound,
} from 'http-errors';
import path from 'node:path';
import wrapper from '../lib/util/express/wrapper';
import logger from '../lib/util/logger';
import { asPlugin } from '../lib/util/typings';
import middleware from './middleware';
import routes from './routes';
import swagger from './swagger';

export default asPlugin(async function setup(app) {
  // -- PRE
  await preConfigure(app);
  // -- PRE END

  await middleware(app, {});

  await routes(app, {
    dirPath: path.resolve(__dirname, '../routes'),
    callback(routeFiles) {
      for (const filePath of routeFiles) {
        logger.info(`${c.bold('registered route')} ${filePath}`);
      }
    },
  });

  await swagger(app, {
    routePrefix: '/docs',
  });

  // -- POST
  await postConfigure(app);
  // -- POST END
});

// execute before anything
async function preConfigure(app: Application) {
  app.disable('x-powered-by');
}

// execute after anything
async function postConfigure(app: Application) {
  app.use('/', express.static(path.resolve(__dirname, '../../public')));
  app.use(
    wrapper(function notFoundHandler(request) {
      throw new NotFound(`Cannot ${request.method} ${request.path}`);
    }),
    function errorHandler(error, _request, response, next) {
      if (!(error instanceof HttpError) && error instanceof Error) {
        if ('statusCode' in error && typeof error.statusCode === 'number') {
          error = createHttpError(error.statusCode, error.message);
        } else {
          error = new InternalServerError(error.message);
        }
      }
      if (error instanceof HttpError) {
        const responseData = {
          statusCode: error.statusCode,
          message: error.message,
          error: error.name,
        };
        if (error.statusCode > 499) logger.error(error.stack);
        return response.status(error.statusCode).json(responseData);
      }
      next(error);
    } satisfies ErrorRequestHandler,
  );
}
