import Ajv, { type InstanceOptions } from 'ajv';
import wrapper from './wrapper';
import { BadRequest } from 'http-errors';

export enum PROP {
  Params = 'params',
  Body = 'body',
  Query = 'query',
}

export default function validate(
  prop: PROP,
  schema: object,
  options?: InstanceOptions,
) {
  const ajv = new Ajv(options);
  return wrapper(function anonymous(request, _, next) {
    const _validate = ajv.compile(schema);
    const isValid = _validate(request[prop]);
    if (!isValid) {
      const message = _validate.errors?.at(0)?.message;
      throw new BadRequest(message);
    }
    next();
  });
}
