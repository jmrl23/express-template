import type { RequestHandler } from 'express';

type NestedArray<T> = Array<T> | Array<NestedArray<T>>;

/**
 * gives you the power to return a value or throw
 * errors directly inside your request handler
 */

export const wrapper = function wrapper(
  ...requestHandlers: NestedArray<RequestHandler | RequestHandler[]>
) {
  const wrappedRequestHandlers: RequestHandler[] = [];

  for (const requestHandler of requestHandlers) {
    if (Array.isArray(requestHandler)) {
      wrappedRequestHandlers.push(...wrapper(...requestHandler));

      continue;
    }

    const wrappedRequestHandler: RequestHandler =
      async function wrappedRequestHandler(request, response, next) {
        try {
          const data = await Promise.resolve(
            requestHandler(request, response, next),
          );
          if (data !== undefined) {
            if (typeof data === 'object') {
              response.json(data);
            } else {
              response.send((data as any)?.toString());
            }
          }
        } catch (error: unknown) {
          if (!response.headersSent) next(error);
        }
      };

    wrappedRequestHandlers.push(wrappedRequestHandler);
  }

  return wrappedRequestHandlers;
};
