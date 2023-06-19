import express from 'express';
import controllers from './controllers';
import { join } from 'path';
import {
  corsMiddleware,
  helmetMiddleware,
  morganMiddleware,
} from './middlewares';
import { errorNotFoundHandler, errorRequestHandler } from './utils/express';

const app = express();

// global middlewares
app.use(
  morganMiddleware(process.env.NODE_ENV === 'production' ? 'common' : 'dev'),
  helmetMiddleware({
    // override defaults here
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  }),
  express.static(join(__dirname, '../public')),
  express.json(),
  express.urlencoded({ extended: false }),
  corsMiddleware({
    origin: 'http://localhost:3000',
  }),
);

// controllers
app.use(controllers);

// error handlers
app.use(errorNotFoundHandler(), errorRequestHandler());

export default app;
