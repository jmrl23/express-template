import './init';
import detectPort from 'detect-port';
import app from './app';
import bootstrap from './bootstrap';
import { logger } from './lib/common';
import { PORT } from './lib/constant/env';

async function main() {
  const host = '0.0.0.0';
  const port = await detectPort(PORT);

  await bootstrap(app);

  app.listen({ host, port }, function () {
    logger.info(`listening on port ${port}`);
  });
}

void main();
