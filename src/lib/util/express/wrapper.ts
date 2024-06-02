import type { RequestHandler } from 'express';
import type {
  Query,
  ParamsDictionary,
  Locals as _Locals,
} from 'express-serve-static-core';

export default function wrapper<
  ReqBody = any,
  ReqParams = unknown,
  ReqQuery = unknown,
>(
  requestHandler: RequestHandler<
    ReqParams & ParamsDictionary,
    any,
    ReqBody,
    ReqQuery & Query
  >,
): typeof requestHandler {
  return async function (request, response, next) {
    try {
      const data = await Promise.resolve(
        requestHandler(request, response, next),
      );
      if (data === undefined) return;
      if (typeof data === 'object') return response.json(data);
      response.send((data as unknown)?.toString());
    } catch (error) {
      if (!response.headersSent) next(error);
    }
  };
}
