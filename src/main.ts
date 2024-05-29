import './initialize';
import { PORT } from './lib/constants/environment';
import detectPort from 'detect-port';
import server from './server';
import logger from './lib/utils/logger';

async function main() {
  const port = await detectPort(PORT);

  server.listen(port, function () {
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
