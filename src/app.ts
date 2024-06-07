import path from 'node:path';
import express, { type ErrorRequestHandler } from 'express';
import loadRoutes from './lib/util/express/loadRoutes';
import logger from './lib/util/logger';
import wrapper from './lib/util/express/wrapper';
import * as colorette from 'colorette';
import createHttpError, {
  HttpError,
  NotFound,
  InternalServerError,
} from 'http-errors';
import morganMiddleware from './middlewares/morgan.middleware';
import cors from 'cors';
import swaggerUiExpress from 'swagger-ui-express';
import { spec } from './lib/docs';

const app = express();

// Configurations
app.disable('x-powered-by');

// Middlewares
app.use(
  morganMiddleware(),
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

// Load route files
const routesDir = path.resolve(__dirname, 'routes');
loadRoutes(app, routesDir, function (routeFiles) {
  for (const filePath of routeFiles) {
    const file = filePath
      .replace(/[\\\/]/g, '/')
      .substring(routesDir.length + 1);
    logger.info(
      `Route %s {%s}`,
      colorette.yellow('Registered'),
      colorette.magentaBright(file),
    );
  }
});

// Swagger UI
app
  .use('/docs', swaggerUiExpress.serve)
  .get('/docs', swaggerUiExpress.setup(spec));

// Static serve
app.use(express.static(path.resolve(__dirname, '../public')));

// Error handlers
app.use(
  wrapper((request) => {
    throw new NotFound(`Cannot ${request.method} ${request.path}`);
  }),
  function (error, _request, response, next) {
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
        error: error.constructor.name,
      };
      if (error.statusCode > 499) {
        logger.error(error.message);
      }
      return response.status(error.statusCode).json(responseData);
    }
    next(error);
  } satisfies ErrorRequestHandler,
);

export default app;
