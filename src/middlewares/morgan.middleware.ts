import morgan, { type Options } from 'morgan';
import type { Request, Response } from 'express';

export const morganMiddleware = (
  format: 'combined' | 'common' | 'dev' | 'short' | 'tiny',
  options?: Options<Request, Response>,
) => {
  return morgan<Request, Response>(format, options);
};
