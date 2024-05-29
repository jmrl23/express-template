import path from 'node:path';
import loadDotEnv from './lib/utils/loadDotEnv';
import { NODE_ENV } from './lib/constants/environment';

console.clear();

loadDotEnv(
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, `../.env.${NODE_ENV}`),
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, `../.env.${NODE_ENV}.local`),
);
