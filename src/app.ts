import express, { json, urlencoded } from 'express';
import controllers from './controllers';
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
  corsMiddleware({
    origin: 'http://localhost:3000',
  }),
  json(),
  urlencoded({ extended: false }),
);

// controllers
app.use(controllers);

// error handlers
app.use(errorNotFoundHandler(), errorRequestHandler());

export default app;
