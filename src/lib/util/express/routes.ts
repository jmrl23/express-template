import { Router } from 'express';
import type { Express } from 'express-serve-static-core';
import { globSync } from 'glob';
import path from 'node:path';

/**
 * route file rules:
 * - name must ends with `.route.{ts,js}`
 * - must export default a route function
 * - prefix can be alter by exporting a prefix
 */

export default function routes(
  app: Express,
  dirPath: string,
  callback?: Callback,
): void {
  const files = globSync([`${dirPath}/**/*.route.{ts,js}`], {
    absolute: true,
  });
  const registeredRouteFiles: string[] = [];
  for (const routeFile of files) {
    const { default: routeFunction, prefix: p, router: r } = require(routeFile);
    if (!(routeFunction instanceof Function)) continue;
    if (r && Object.getPrototypeOf(r) !== Router)
      throw new Error('Invalid route router');
    if (p && typeof p !== 'string') throw new Error('Invalid route prefix');
    const _path = routeFile.replace(/[\\/]/g, '/').substring(dirPath.length);
    const fileName = path.basename(routeFile);
    const prefix =
      p ?? (_path.substring(0, _path.length - fileName.length - 1) || '/');
    const router = r ?? Router();
    app.use(prefix, router);
    routeFunction(router);
    registeredRouteFiles.push(routeFile);
  }

  callback?.(registeredRouteFiles);
}

interface Callback {
  (routeFiles: string[]): void;
}
