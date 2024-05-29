import type { RequestHandler } from 'express';
import type { Query, Locals as _Locals } from 'express-serve-static-core';

export default function wrapper<
  ReqBody = unknown,
  ReqParams = unknown,
  ReqQuery = Query,
>(
  requestHandler: RequestHandler<ReqParams, unknown, ReqBody, ReqQuery>,
): typeof requestHandler {
  return async function (request, response, next) {
    try {
      const data = await Promise.resolve(
        requestHandler(request, response, next),
      );
      if (data !== undefined) {
        if (typeof data === 'object') {
          response.json(data);
          return;
        }
        response.send((data as unknown)?.toString());
      }
    } catch (error: unknown) {
      if (!response.headersSent) next(error);
    }
  };
}
