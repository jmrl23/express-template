import path from 'node:path';
import fs from 'node:fs';
import { Router } from 'express';
import type { Express } from 'express-serve-static-core';

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
  const loadedRoutes: string[] = [];

  for (const routeFile of routeFiles) {
    const mod = require(routeFile);
    if (!(mod.default instanceof Function)) continue;
    const _path = routeFile
      .substring(dirPath.length)
      .replace(/[\\\/]/g, '/')
      .split('/');
    _path.splice(-1);
    const prefix = mod.prefix ?? (_path.join('/') || '/');
    const router = Router();
    app.use(prefix, router);
    mod.default(router);
    loadedRoutes.push(routeFile);
  }

  callback?.(loadedRoutes);
}

function getFileList(dirPath: string): string[] {
  const files: string[] = [];
  const dirFiles = fs.readdirSync(dirPath);

  for (const file of dirFiles) {
    const filePath = path.resolve(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files.push(...getFileList(filePath));
      continue;
    }
    files.push(filePath);
  }

  return files;
}

interface LoadRoutesCallback {
  (routeFiles: string[]): void;
}
