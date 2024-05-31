import path from 'node:path';
import fs from 'node:fs';

export default function getFileList(dirPath: string): string[] {
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
