import { Router } from 'express';
import type { Express } from 'express-serve-static-core';
import getFileList from '../getFileList';
import path from 'node:path';

export default function loadRoutes(
  app: Express,
  dirPath: string,
  callback?: LoadRoutesCallback,
): void {
  const files = getFileList(dirPath);
  const routeFiles = files.filter((file) => {
    const extensions = ['js', 'ts'];
    const fileName = path.basename(file);
    const isRouteFile = extensions.some((ext) =>
      fileName.toLowerCase().endsWith(`.route.${ext}`),
    );
    return isRouteFile;
  });
  const loadedRoutes: string[] = [];

  for (const routeFile of routeFiles) {
    const { default: routeFunction, prefix: p, router: r } = require(routeFile);
    if (!(routeFunction instanceof Function)) continue;
    const _path = routeFile.replace(/[\\\/]/g, '/').substring(dirPath.length);
    const fileName = path.basename(routeFile);
    const prefix =
      p ?? (_path.substring(0, _path.length - fileName.length - 1) || '/');
    const router = r ?? Router();
    app.use(prefix, router);
    routeFunction(router);
    loadedRoutes.push(routeFile);
  }

  callback?.(loadedRoutes);
}

interface LoadRoutesCallback {
  (routeFiles: string[]): void;
}
