import './init';
import { SERVER_HOST, PORT } from './lib/constant/env';
import detectPort from 'detect-port';
import server from './server';
import * as c from 'colorette';
import logger from './lib/util/logger';

async function main() {
  const host = SERVER_HOST;
  const port = await detectPort(PORT);

  server.listen({ host, port }, function () {
    logger.info(`${c.bold('server port')} ${port}`);
  });
}

void main();
