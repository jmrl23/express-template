import Ajv, { type Options } from 'ajv';
import wrapper from './wrapper';
import betterAjvErrors from 'better-ajv-errors';
import { BadRequest } from 'http-errors';
import type { RequestHandler } from 'express';
import type { Schema } from './typings';

export enum PROP {
  Params = 'params',
  Body = 'body',
  Query = 'query',
}

export default function validate(
  prop: PROP,
  schema: Schema,
  options: Options = {},
): RequestHandler {
  const ajv = new Ajv({
    strict: true,
    coerceTypes: true,
    ...options,
    allErrors: true,
  });
  return wrapper(function anonymous(request, _, next) {
    const _validate = ajv.compile(schema);
    const data = request[prop];
    const valid = _validate(data);
    if (!valid) {
      const errors = betterAjvErrors(schema, data, _validate.errors ?? [], {
        format: 'js',
      });
      const error = errors[0];
      const message = error.error.trim();
      throw new BadRequest(message);
    }
    next();
  });
}
