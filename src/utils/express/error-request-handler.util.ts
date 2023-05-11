import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import {
  HttpException,
  InternalServerErrorException,
} from '../../exceptions/http';

const defaultErrorRequestHandler: ErrorRequestHandler =
  function defaultErrorRequestHandler(
    error: unknown,
    _request: Request,
    response: Response,
    next: NextFunction,
  ) {
    if (!(error instanceof HttpException) && error instanceof Error) {
      console.error(error);
      error = new InternalServerErrorException(error.message);
    }

    if (error instanceof HttpException) {
      const statusCode = error.getStatusCode();
      const responseData = error.getResponse();

      return response.status(statusCode).json(responseData);
    }

    next(error);
  };

/**
 * set custom error handler for your express application
 */

export const errorRequestHandler = function errorRequestHandler(
  errorRequestHandler?: ErrorRequestHandler,
) {
  if (!errorRequestHandler) return defaultErrorRequestHandler;
  return errorRequestHandler;
};
