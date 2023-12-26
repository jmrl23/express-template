import cors, { type CorsOptions } from 'cors';

export const corsMiddleware = function corsMiddleware(
  options: CorsOptions = {},
) {
  return cors({
    ...options,
  });
};
