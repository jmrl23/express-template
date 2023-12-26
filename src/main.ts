import './init';
import env from 'env-var';
import detectPort from 'detect-port';
import { server } from './server';
import { underline } from 'colorette';
import { logger } from './lib/utils/logger';
import { getServerUrl } from './lib/utils/get-server-url';

async function main(): Promise<void> {
  const port = await detectPort(env.get('PORT').default(3001).asPortNumber());

  server.listen(port, () => {
    logger.info(underline(getServerUrl(server)));
  });
}

void main();
