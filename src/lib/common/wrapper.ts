import {
  Locals,
  RequestHandler as ExpressRequestHandler,
  Query,
  ParamsDictionary,
} from 'express-serve-static-core';

export interface WPayload<P extends Payload = Payload> {
  Payload: P;
}

export default function wrapper<WP extends WPayload>(
  requestHandler: RequestHandler<WP>,
): RequestHandler<WP> {
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

interface Payload {
  RequestBody?: unknown;
  RequestParams?: unknown;
  RequestQuery?: unknown;
  ResponseBody?: unknown;
}
type TypeWithFallback<T, F> = unknown extends T ? F : T;
interface RequestHandler<WP extends WPayload<Payload>>
  extends ExpressRequestHandler<
    TypeWithFallback<WP['Payload']['RequestParams'], ParamsDictionary>,
    TypeWithFallback<WP['Payload']['ResponseBody'], any>,
    TypeWithFallback<WP['Payload']['RequestBody'], any>,
    TypeWithFallback<WP['Payload']['RequestQuery'], Query>,
    Locals
  > {}
