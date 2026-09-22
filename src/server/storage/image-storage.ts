import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

export interface ImageStorage {
  upload(
    data: Buffer,
    folder: string,
    filename: string,
  ): Promise<{ url: string; key: string }>;
  delete(key: string): Promise<void>;
}

export class LocalImageStorage implements ImageStorage {
  private root = path.join(process.cwd(), "public", "uploads");

  async upload(
    data: Buffer,
    folder: string,
    filename: string,
  ): Promise<{ url: string; key: string }> {
    const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "");
    const ext = path.extname(filename) || ".jpg";
    const key = `${safeFolder}/${nanoid(12)}${ext}`;
    const full = path.join(this.root, key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);
    return { url: `/uploads/${key.replace(/\\/g, "/")}`, key };
  }

  async delete(key: string): Promise<void> {
    const full = path.join(this.root, key);
    try {
      await fs.unlink(full);
    } catch {
      // ignore missing
    }
  }
}

export const imageStorage: ImageStorage = new LocalImageStorage();
