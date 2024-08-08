import { Router } from 'express';
import { glob } from 'glob';
import path from 'node:path';
import util from 'node:util';
import { asPlugin } from '../lib/common';

interface Options {
  dirPath: string;
  callback?: Callback;
}

interface Callback {
  (routeFiles: string[]): void;
}

/**
 * routes
 * - filename must ends with `.route.{ts,js}`
 * - must export default a route function
 *   check `src/lib/common/typings.ts` line 10 to 15
 * - prefix can be alter by exporting a prefix variable,
 *   example: `export const prefix = '/example'`
 */

export default asPlugin(async function routes(app, options: Options) {
  const { dirPath, callback } = options;
  const files = await glob([`${dirPath}/**/*.route.{ts,js}`], {
    absolute: true,
  });

  const registeredRouteFiles: string[] = [];

  for (const routeFile of files) {
    const route = await import(routeFile);
    if (!util.types.isAsyncFunction(route.default)) continue;

    const _path = routeFile.replace(/[\\/]/g, '/').substring(dirPath.length);
    const fileName = path.basename(routeFile);

    if ('prefix' in route && typeof route.prefix !== 'string')
      throw new Error('Invalid route prefix');

    if (route.router && Object.getPrototypeOf(route.router) !== Router)
      throw new Error('Invalid route router');

    const prefix: string =
      route.prefix ??
      (_path.substring(0, _path.length - fileName.length - 1) || '/');
    const router = route.router ?? Router();

    route.default(router, app);
    app.use(prefix, router);
    registeredRouteFiles.push(routeFile);
  }

  callback?.(registeredRouteFiles);
});
