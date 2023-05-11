import { Router } from 'express';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * all controllers inside this directory (controllers) will be
 * exported as default
 *
 * RULES:
 * - controllers should be exported as `controller`
 * - filenames should be in `[name].controller.{js,ts}` format
 * - controllers with `index` names will automatically treated as `/`
 * - you can make nested directories
 * - non-controller files will be ignored
 */

const router = Router();

function throughDirectory(dir: string) {
  const collection: string[] = [];
  for (const file of readdirSync(dir)) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      collection.push(...throughDirectory(filePath));
      continue;
    }
    collection.push(filePath);
  }
  return collection;
}
const files = throughDirectory(__dirname);
for (const file of files) {
  const controllerPattern = /\.controller\.(ts|js)$/gi;
  const controllerSuffix = file.match(controllerPattern);
  const controllerName = file
    .replace(__dirname, '')
    .replace(controllerPattern, '')
    .replace(/\\/g, '/')
    .replace(/\/index$/i, '/');
  if (!controllerSuffix || controllerName.match(/\..+$/i)) continue;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(file);
  if (
    typeof mod !== 'object' ||
    Object.getPrototypeOf(mod?.controller) !== Router
  )
    continue;
  router.use(controllerName, mod.controller);
}

export default router;
