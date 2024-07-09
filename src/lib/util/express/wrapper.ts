import type {
  Locals,
  RequestHandler,
  Query,
  ParamsDictionary,
} from 'express-serve-static-core';

export default function wrapper<P extends WrapperPayload>(
  requestHandler: RequestHandlerWithWrapperPayload<P>,
): RequestHandlerWithWrapperPayload<P> {
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

export type WrapperPayload = {
  RequestBody?: unknown;
  RequestParams?: unknown;
  RequestQuery?: unknown;
  ResponseBody?: unknown;
};
type TypeWithFallback<T, F> = unknown extends T ? F : T;
type RequestHandlerWithWrapperPayload<P extends WrapperPayload> =
  RequestHandler<
    TypeWithFallback<P['RequestParams'], ParamsDictionary>,
    TypeWithFallback<P['ResponseBody'], any>,
    TypeWithFallback<P['RequestBody'], any>,
    TypeWithFallback<P['RequestQuery'], Query>,
    Locals
  >;
