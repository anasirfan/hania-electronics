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
          Every image in storage. Download a file, resize it, then upload the
          smaller version and use it on banners, products, or categories.
        </p>
      </div>
      <MediaBrowser />
    </div>
  );
}
