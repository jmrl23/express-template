// Warn: Do not import variables from `src/lib/constant/env.ts` here.

import * as c from 'colorette';
import dotenv from 'dotenv';
import env from 'env-var';
import { globSync } from 'glob';
import logger from './lib/util/logger';

console.clear();

export const NODE_ENV: NODE_ENV_VALUE = env
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'production', 'test']);

const envPaths = globSync(
  ['.env', `.env.${NODE_ENV}`, '.env.local', `.env.${NODE_ENV}.local`],
  { absolute: true },
);

for (const filePath of envPaths) {
  const { parsed } = dotenv.config({
    path: filePath,
    override: true,
  });
  if (Object.keys(parsed ?? {}).length < 1) continue;
  logger.info(`${c.bold('registered env')} ${filePath}`);
}
