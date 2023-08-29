import { existsSync, mkdir, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { v4 } from 'uuid';

export const saveFile = async (data: Buffer) => {
  const dirPath = resolve(__dirname, '..', 'assets');
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  const filename = v4();
  const filePath = join(dirPath, filename);
  await writeFile(filePath, data);
  return filename;
};
