import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/server/supabase/client";

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
    const key = `media/${safeFolder}/${nanoid(12)}${ext}`;
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

class SupabaseImageStorage implements ImageStorage {
  private local = new LocalImageStorage();

  private client() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  async upload(
    data: Buffer,
    folder: string,
    filename: string,
  ): Promise<{ url: string; key: string }> {
    try {
      const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "");
      const ext = path.extname(filename) || ".jpg";
      const key = `media/${safeFolder}/${nanoid(12)}${ext}`;
      const sb = this.client();
      const { error } = await sb.storage.from("uploads").upload(key, data, {
        contentType: guessContentType(ext),
        upsert: false,
      });
      if (error) throw error;
      const { data: pub } = sb.storage.from("uploads").getPublicUrl(key);
      return { url: pub.publicUrl, key };
    } catch (error) {
      console.warn(
        "[storage] Supabase upload failed, using local:",
        error instanceof Error ? error.message : error,
      );
      return this.local.upload(data, folder, filename);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const sb = this.client();
      await sb.storage.from("uploads").remove([key]);
    } catch {
      await this.local.delete(key);
    }
  }
}

function guessContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

export const imageStorage: ImageStorage = isSupabaseConfigured()
  ? new SupabaseImageStorage()
  : new LocalImageStorage();
