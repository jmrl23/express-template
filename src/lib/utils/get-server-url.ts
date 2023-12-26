import type { Server } from 'node:http';
import { vendors } from '@jmrl23/express-helper';

export const getServerUrl = function getServerUrl(server: Server): string {
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw vendors.httpErrors.InternalServerError('No server address');
  }

  const port = address.port;
  const protocol = port === 443 ? 'https://' : 'http://';
  const url = [80, 443].includes(port)
    ? `${protocol}localhost`
    : `${protocol}localhost:${port}`;

  return url;
};

export default getServerUrl;
