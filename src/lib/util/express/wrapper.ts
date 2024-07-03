import type { RequestHandler } from 'express';

export default function wrapper<T extends Payload>(
  requestHandler: RequestHandler<T['params'], any, T['body'], T['query']>,
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

interface Payload
  extends Partial<Record<'params' | 'query' | 'body', unknown>> {}
