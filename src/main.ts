import './init';
import { SERVER_HOSTNAME, PORT } from './lib/constant/environment';
import detectPort from 'detect-port';
import server from './server';
import logger from './lib/util/logger';

async function main() {
  const host = SERVER_HOSTNAME;
  const port = await detectPort(PORT);

  server.listen({ host, port }, function () {
    const serverAddress = server.address();
    if (!serverAddress || typeof serverAddress === 'string') return;
    const address =
      serverAddress.family === 'IPv6'
        ? `[${serverAddress.address}]`
        : serverAddress.address;
    const _port = [80, 443].includes(port) ? '' : `:${port}`;
    const protocol = [80, 443].includes(port) ? 'https://' : 'http://';
    logger.info(`${protocol}${address}${_port}`);
  });
}

void main();
