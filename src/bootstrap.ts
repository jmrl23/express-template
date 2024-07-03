import * as c from 'colorette';
import type { Application, ErrorRequestHandler } from 'express';
import express from 'express';
import createHttpError, {
  HttpError,
  InternalServerError,
  NotFound,
} from 'http-errors';
import path from 'node:path';
import wrapper from './lib/util/express/wrapper';
import logger from './lib/util/logger';
import { asPlugin } from './lib/util/typings';
import middleware from './plugins/middleware';
import routes from './plugins/routes';
import swagger from './plugins/swagger';

/**
 * bootstraps all plugins and configurations
 *
 * this serves as the main entrypoint for plugins and
 * configurations of the main app instance.
 */
export default asPlugin(async function bootstrap(app) {
  await middleware(app);

  await routes(app, {
    dirPath: path.resolve(__dirname, './routes'),
    callback(routes) {
      for (const route of routes) {
        logger.info(`${c.bold('registered route')} ${route}`);
      }
    },
  });

  await swagger(app, {
    routePrefix: '/docs',
  });

  await postConfigurations(app);
});

/**
 * should only be applied **after** everything else
 */
async function postConfigurations(app: Application) {
  app.use('/', express.static(path.resolve(__dirname, '../../public')));

  // error handlers
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
