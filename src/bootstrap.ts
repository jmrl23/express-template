import * as c from 'colorette';
import express, { Application, ErrorRequestHandler } from 'express';
import createHttpError, {
  HttpError,
  InternalServerError,
  NotFound,
} from 'http-errors';
import path from 'node:path';
import { asPlugin, logger, wrapper } from './lib/common';
import middlewares from './plugins/middlewares';
import routes from './plugins/routes';
import swagger from './plugins/swagger';

export default asPlugin(async function (app) {
  app.disable('x-powered-by');
  app.set('case sensitive routing', true);

  await middlewares(app);

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

async function postConfigurations(app: Application) {
  app.use('/', express.static(path.resolve(__dirname, '../public')));

  // custom error handlers
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
