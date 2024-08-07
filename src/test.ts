import { glob } from 'glob';
import path from 'node:path';

async function test() {
  const patterns = [
    '**/*.spec.js',
    '**/*.spec.ts',
    '**/*.test.js',
    '**/*.test.ts',
  ];
  const files = await glob(
    patterns.map((pattern) => path.resolve(__dirname, pattern)),
  );
  await Promise.all(files.map((file) => import(file)));
}
void test();
