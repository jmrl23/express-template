import './init';
import * as c from 'colorette';
import detectPort from 'detect-port';
import app from './app';
import bootstrap from './bootstrap';
import { logger } from './lib/common';
import { PORT, SERVER_HOST } from './lib/constant/env';

async function main() {
  const host = SERVER_HOST;
  const port = await detectPort(PORT);

  await bootstrap(app);

  app.listen({ host, port }, function () {
    logger.info(`${c.bold('server port')} ${port}`);
  });
}

void main();
