"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Download, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type MediaFile = {
  key: string;
  name: string;
  folder: string;
  size: number;
  updatedAt: string;
  url: string;
};

function formatSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaBrowser({
  onSelect,
}: {
  onSelect?: (url: string) => void;
}) {
  const [files, setFiles] = React.useState<MediaFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [folder, setFolder] = React.useState("all");
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not load media");
        return;
      }
      setFiles(data.files ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "library");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      toast.success("Uploaded");
      await load();
      onSelect?.(data.url as string);
    } finally {
      setUploading(false);
    }
  }

  const folders = React.useMemo(() => {
    const set = new Set(files.map((f) => f.folder));
    return ["all", ...[...set].sort()];
  }, [files]);

  const q = query.trim().toLowerCase();
  const shown = files.filter((f) => {
    if (folder !== "all" && f.folder !== folder) return false;
    if (!q) return true;
    return `${f.name} ${f.folder}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search file name…"
            className="h-10 w-full rounded-xl border border-input bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center rounded-full bg-primary px-4 text-sm font-medium text-white">
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*,video/mp4,video/webm"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {folders.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFolder(name)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
              folder === name
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground/70"
            }`}
          >
            {name === "all" ? "All" : name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading media…</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files match.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((file) => (
            <li
              key={file.key}
              className="overflow-hidden rounded-xl border border-border bg-white"
            >
              <button
                type="button"
                className="relative block aspect-square w-full bg-[#F4F6F9]"
                onClick={() => onSelect?.(file.url)}
                disabled={!onSelect}
              >
                {file.name.match(/\.(mp4|webm)$/i) ? (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Video
                  </span>
                ) : (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
              </button>
              <div className="space-y-1 p-2">
                <p className="truncate text-xs font-medium" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] ${
                      file.size > 1024 * 1024
                        ? "font-semibold text-amber-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatSize(file.size)}
                  </span>
                  <a
                    href={`/api/admin/media/download?key=${encodeURIComponent(file.key)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MediaLibraryButton({
  onSelect,
  label = "Library",
}: {
  onSelect: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="text-sm font-medium text-primary"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Media library</DialogTitle>
            <DialogDescription>
              Pick a file already uploaded, or upload a new one. Files over 1 MB
              are marked so you can download and replace them.
            </DialogDescription>
          </DialogHeader>
          <MediaBrowser
            onSelect={(url) => {
              onSelect(url);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
