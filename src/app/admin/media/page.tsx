"use client";

import { MediaBrowser } from "@/features/admin/media-browser";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Media library
        </h1>
        <p className="text-sm text-muted-foreground">
          Thumbnails load a page at a time as you scroll, the same way a
          WordPress media library does. Download a large file, resize it, then
          upload the smaller version.
        </p>
      </div>
      <MediaBrowser />
    </div>
  );
}
