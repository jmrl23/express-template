import type { Express } from 'express-serve-static-core';
import path from 'node:path';
import fs from 'node:fs';

export default function loadRoutes(
  app: Express,
  dirPath: string,
  callback?: LoadRoutesCallback,
): void {
  const files = getFileList(dirPath);
  const routeFiles = files.filter((file) => {
    const isRouteFile = /\.route\.(ts|js)$/.test(file);
    return isRouteFile;
  });

  for (const routeFile of routeFiles) {
    const mod = require(routeFile);
    const _path = routeFile
      .substring(dirPath.length)
      .replace(/[\\\/]/g, '/')
      .split('/');
    _path.splice(-1);
    const prefix: string = mod.prefix ?? (_path.join('/') || '/');
    app.use(prefix, mod.default);
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

interface LoadRoutesCallback {
  (routeFiles: string[]): void;
}
