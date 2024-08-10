import env from 'env-var';

export const NODE_ENV = process.env.NODE_ENV;

export const PORT = env.get('PORT').default(3001).asPortNumber();
