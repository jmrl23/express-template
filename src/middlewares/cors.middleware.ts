import cors, { type CorsOptions } from 'cors';

export const corsMiddleware = (options: CorsOptions = {}) => {
  return cors({
    ...options,
  });
};
