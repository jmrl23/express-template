import type { Express } from 'express-serve-static-core';
import path from 'node:path';
import fs from 'node:fs';

export default function loadRoutes(
  app: Express,
  dirPath: string,
  callback?: LoadRouteCallback,
): void {
  const files = getFileList(dirPath);
  const routeFiles = files.filter((file) => {
    const isRouteFile = /\.route.(ts|js)$/.test(file);
    return isRouteFile;
  });

  for (const file of routeFiles) {
    const filePath = file.substring(dirPath.length);
    const prefix = filePath
      .replace(/([a-zA-Z\-\_0-9])+\.route\.(ts|js)$/, '')
      .replace(new RegExp(`\\${path.sep}`, 'g'), '/');
    const { app: _app, middlewares, autoPrefix } = require(file);

    if (_app) {
      const _prefix = autoPrefix ? autoPrefix.replace('/', '') : '';
      const _middlewares = Array.isArray(middlewares) ? middlewares : [];
      app.use(`${prefix}${_prefix}`, _middlewares, _app);
    }
  }

  callback?.(routeFiles);
}

function getFileList(dirPath: string): string[] {
  const files = fs
    .readdirSync(dirPath)
    .map((file) => {
      const filePath = path.resolve(dirPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) return getFileList(filePath);
      return filePath;
    })
    .flat();

  return files;
}

interface LoadRouteCallback {
  (routeFiles: string[]): void;
}
