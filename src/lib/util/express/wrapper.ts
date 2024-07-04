import type { RequestHandler, Locals } from 'express-serve-static-core';

export default function wrapper<P extends Payload>(
  requestHandler: RequestHandlerWithPayload<P>,
): RequestHandlerWithPayload<P> {
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

type Keys = ['body', 'params', 'query', 'response'];
type Payload = Partial<Record<Keys[number], unknown>>;
type RequestHandlerWithPayload<P extends Payload> = RequestHandler<
  P['params'],
  P['response'],
  P['body'],
  P['query'],
  Locals
>;
