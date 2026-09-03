import fs from'node:fs/promises';
import path from'node:path';

class FileLock {
  private queue: Promise<void> = Promise.resolve();

  async runWithLock<T>(fn: () => Promise<T>): Promise<T> {
    let resolveLock!: () => void;
    const nextLock = new Promise<void>((res) => {
      resolveLock = res;
    });

    const previousQueue = this.queue;
    this.queue = nextLock;

    try {
      await previousQueue;
      return await fn();
    } finally {
      resolveLock();
    }
  }
}

export const fileLock = new FileLock();

export async function safeReadJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath,'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    return fallback;
  }
}

export async function safeWriteJson<T>(filePath: string, data: T): Promise<void> {
  return fileLock.runWithLock(async () => {
    const dir = path.dirname(filePath);
    const tempFile = path.join(dir, `.temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`);
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2),'utf-8');
    await fs.rename(tempFile, filePath);
  });
}
