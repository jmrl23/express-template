import Ajv, { type Options } from 'ajv';
import wrapper from './wrapper';
import { BadRequest } from 'http-errors';
import type { JSONSchema } from 'json-schema-to-ts';

export enum PROP {
  Params = 'params',
  Body = 'body',
  Query = 'query',
}

export default function validate(
  prop: PROP,
  schema: JSONSchema,
  options: Options = {},
) {
  const ajv = new Ajv({
    strict: true,
    coerceTypes: true,
    allErrors: true,
    ...options,
  });
  return wrapper(function anonymous(request, _, next) {
    const _validate = ajv.compile(schema);
    const data = request[prop];
    const isValid = _validate(data);
    const error = _validate.errors?.at(0);
    if (!isValid && error) {
      const message = `[${error.schemaPath}] ${error.message}`;
      throw new BadRequest(message);
    }
    next();
  });
}
