import Ajv, { type Options } from 'ajv';
import wrapper from './wrapper';
import betterAjvErrors from 'better-ajv-errors';
import { BadRequest } from 'http-errors';
import type { JSONSchema } from 'json-schema-to-ts';

export enum PROP {
  Params = 'params',
  Body = 'body',
  Query = 'query',
}

type Schema = JSONSchema & Record<string, unknown>;

// For JS folks
export function asSchema(schema: Schema): JSONSchema {
  return schema;
}

export default function validate(
  prop: PROP,
  schema: Schema,
  options: Options = {},
) {
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
