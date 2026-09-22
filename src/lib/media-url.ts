/**
 * Resolve a site-relative asset path to a Supabase Storage public URL.
 * e.g. "/media/brand/he3.webp" →
 *   https://xxx.supabase.co/storage/v1/object/public/uploads/media/brand/he3.webp
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const key = path.replace(/^\/+/, "");
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return `/${key}`;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/uploads/${key}`;
}

/** Bucket used for catalog + admin uploads */
export const MEDIA_BUCKET = "uploads";
