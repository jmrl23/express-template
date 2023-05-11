import type { RequestHandler } from 'express';
import { NotFoundException } from '../../exceptions/http';
import { wrapper } from './wrapper.util';

const defaultErrorNotFoundHandler: RequestHandler = wrapper(
  function defaultErrorNotFoundHandler(request) {
    throw new NotFoundException(`Cannot ${request.method} ${request.url}`);
  },
)[0];

/**
 * set custom error 404 for you express application
 */

export const errorNotFoundHandler = function errorNotFoundHandler(
  requestHandler?: RequestHandler,
) {
  if (!requestHandler) return defaultErrorNotFoundHandler;
  return requestHandler;
};
