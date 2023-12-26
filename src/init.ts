import { join } from 'node:path';
import { loadEnvFiles } from './lib/utils/load-env-files';

console.clear();

const nodeEnvironment = process.env.NODE_ENV ?? 'development';

loadEnvFiles(
  join(__dirname, '../.env'),
  join(__dirname, `../.env.${nodeEnvironment}`),
  join(__dirname, '../.env.local'),
  join(__dirname, `../.env.${nodeEnvironment}.local`),
);
