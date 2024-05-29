import dotenv from 'dotenv';
import path from 'node:path';
import * as colorette from 'colorette';
import logger from './logger';

export default function loadDotEnv(...paths: string[]): void {
  for (const fileLocation of paths) {
    const data = dotenv.config({ path: fileLocation, override: true }).parsed;

    if (!data || Object.keys(data).length < 1) continue;

    const envFileName = path.basename(fileLocation);

    logger.debug(
      `DotEnvFile ${colorette.yellow('Loaded')} ${colorette.magentaBright(envFileName)}`,
    );
  }
}
