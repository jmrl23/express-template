import Ajv, { type Options } from 'ajv';
import wrapper from './wrapper';
import ajvFormats from 'ajv-formats';
import betterAjvErrors from 'better-ajv-errors';
import { BadRequest } from 'http-errors';
import type { RequestHandler } from 'express';
import type { Schema } from '../typings';

const PROPS = ['params', 'body', 'query'] as const;

type Prop = (typeof PROPS)[number];

export default function validate(
  prop: Prop,
  schema: Schema,
  options: Options = {},
): RequestHandler {
  const ajv = new Ajv({
    strict: true,
    coerceTypes: true,
    ...options,
    allErrors: true,
  });
  ajvFormats(ajv);
  const _validate = ajv.compile(schema);
  return wrapper(function anonymous(request, _, next) {
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
