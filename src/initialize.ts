import path from 'node:path';
import loadDotEnv from './lib/utils/loadDotEnv';

console.clear();

const NODE_ENV = process.env.NODE_ENV ?? 'development';

loadDotEnv(
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, `../.env.${NODE_ENV}`),
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, `../.env.${NODE_ENV}.local`),
);
