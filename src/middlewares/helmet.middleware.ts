import helmet, { type HelmetOptions } from 'helmet';

export const helmetMiddleware = (options: HelmetOptions = {}) => {
  return helmet({
    ...options,
  });
};
