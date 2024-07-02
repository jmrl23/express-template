import env from 'env-var';

export const NODE_ENV: NODE_ENV_VALUE = env
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'production', 'test']);

export const SERVER_HOST = env.get('SERVER_HOST').default('0.0.0.0').asString();

export const PORT = env.get('PORT').default(3001).asPortNumber();
