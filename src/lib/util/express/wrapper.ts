import type {
  Locals,
  RequestHandler as ExpressRequestHandler,
  Query,
  ParamsDictionary,
} from 'express-serve-static-core';

export default function wrapper<P extends Payload>(
  requestHandler: RequestHandler<P>,
): RequestHandler<P> {
  return async function (request, response, next) {
    try {
      const data = await Promise.resolve(
        requestHandler(request, response, next),
      );
      if (data === undefined) return;
      if (typeof data === 'object') return response.json(data);
      response.send(data);
    } catch (error) {
      if (!response.headersSent) next(error);
    }
  };
}

type Payload = {
  RequestBody?: unknown;
  RequestParams?: unknown;
  RequestQuery?: unknown;
  ResponseBody?: unknown;
};
type TypeWithFallback<T, F> = unknown extends T ? F : T;
type RequestHandler<P extends Payload> = ExpressRequestHandler<
  TypeWithFallback<P['RequestParams'], ParamsDictionary>,
  TypeWithFallback<P['ResponseBody'], any>,
  TypeWithFallback<P['RequestBody'], any>,
  TypeWithFallback<P['RequestQuery'], Query>,
  Locals
>;
