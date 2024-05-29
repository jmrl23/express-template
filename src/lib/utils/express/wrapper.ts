import type { RequestHandler } from 'express';

export default function wrapper<T extends RequestHandler>(
  requestHandler: T,
): RequestHandler {
  return async function (request, response, next) {
    try {
      const data = await Promise.resolve(
        requestHandler(request, response, next),
      );
      if (data !== undefined) {
        if (typeof data === 'object') {
          response.json(data);
        } else {
          response.send((data as unknown)?.toString());
        }
        return;
      }
    } catch (error: unknown) {
      if (!response.headersSent) next(error);
    }
  };
}
