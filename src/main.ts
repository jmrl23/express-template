import './init';
import * as c from 'colorette';
import detectPort from 'detect-port';
import app from './app';
import bootstrap from './bootstrap';
import { PORT, SERVER_HOST } from './lib/constant/env';
import logger from './lib/util/logger';

async function main() {
  const host = SERVER_HOST;
  const port = await detectPort(PORT);

  await bootstrap(app);

  app.listen({ host, port }, function () {
    logger.info(`${c.bold('server port')} ${port}`);
  });
}

void main();
