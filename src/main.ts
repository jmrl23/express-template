import './init';
import * as c from 'colorette';
import detectPort from 'detect-port';
import app from './app';
import { PORT, SERVER_HOST } from './lib/constant/env';
import logger from './lib/util/logger';
import setup from './plugins/setup';
import server from './server';

async function main() {
  const host = SERVER_HOST;
  const port = await detectPort(PORT);

  await setup(app, {});

  server.listen({ host, port }, function () {
    logger.info(`${c.bold('server port')} ${port}`);
  });
}

void main();
