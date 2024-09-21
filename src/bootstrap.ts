import express, { Application, ErrorRequestHandler } from 'express';
import createHttpError, {
  HttpError,
  InternalServerError,
  NotFound,
} from 'http-errors';
import path from 'node:path';
import { asPlugin, logger, wrapper } from './lib/common';
import docsPlugin from './modules/docs/docsPlugin';
import middlewares from './plugins/middlewares';
import routes from './plugins/routes';

export default asPlugin(async function (app) {
  app.disable('x-powered-by');
  app.set('case sensitive routing', true);
  app.set('etag', 'strong');

  await middlewares(app);

  await docsPlugin(app, {
    prefix: '/docs',
  });

  await routes(app, {
    dirPath: path.resolve(__dirname, './modules'),
    callback(routes) {
      for (const route of routes) {
        logger.info(`registered route {${route}}`);
      }
    },
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
