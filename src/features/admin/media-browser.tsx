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

const PAGE = 24;

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
  const [total, setTotal] = React.useState(0);
  const [folders, setFolders] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [folder, setFolder] = React.useState("all");
  const [uploading, setUploading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const requestId = React.useRef(0);

  const loadPage = React.useCallback(
    async (offset: number, replace: boolean) => {
      const id = ++requestId.current;
      if (replace) setLoading(true);
      else setLoadingMore(true);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE),
          offset: String(offset),
          folder,
        });
        if (query.trim()) params.set("q", query.trim());
        const res = await fetch(`/api/admin/media?${params}`);
        const data = await res.json();
        if (id !== requestId.current) return;
        if (!res.ok) {
          toast.error(data.error ?? "Could not load media");
          return;
        }
        const next = (data.files ?? []) as MediaFile[];
        setTotal(data.total ?? next.length);
        setFolders(data.folders ?? []);
        setFiles((current) => (replace ? next : [...current, ...next]));
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [folder, query],
  );

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      void loadPage(0, true);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [loadPage]);

  const hasMore = files.length < total;

  React.useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || loadingMore) return;
        void loadPage(files.length, false);
      },
      { root, rootMargin: "240px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [files.length, hasMore, loadPage, loading, loadingMore]);

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
      await loadPage(0, true);
      onSelect?.(data.url as string);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
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
        {["all", ...folders].map((name) => (
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

      <p className="text-xs text-muted-foreground">
        {loading ? "Loading first page…" : `${files.length} of ${total} files`}
      </p>

      <div ref={scrollRef} className="max-h-[58vh] overflow-y-auto pr-1">
        {loading && files.length === 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-[#F4F6F9]"
              />
            ))}
          </div>
        ) : files.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No files match.
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {files.map((file) => (
              <li key={file.key}>
                <button
                  type="button"
                  disabled={!onSelect}
                  onClick={() => onSelect?.(file.url)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-border bg-[#F4F6F9] disabled:cursor-default"
                  title={file.name}
                >
                  {file.name.match(/\.(mp4|webm)$/i) ? (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                      Video
                    </span>
                  ) : (
                    <Image
                      src={file.url}
                      alt=""
                      fill
                      sizes="160px"
                      loading="lazy"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-6 text-left">
                    <span className="block truncate text-[10px] font-medium text-white">
                      {file.name}
                    </span>
                    <span
                      className={`text-[10px] ${
                        file.size > 1024 * 1024 ? "text-amber-200" : "text-white/70"
                      }`}
                    >
                      {formatSize(file.size)}
                    </span>
                  </span>
                </button>
                <a
                  href={`/api/admin/media/download?key=${encodeURIComponent(file.key)}`}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
        <div ref={sentinelRef} className="h-8" />
        {loadingMore ? (
          <p className="pb-3 text-center text-xs text-muted-foreground">
            Loading more…
          </p>
        ) : null}
      </div>
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
        <DialogContent className="max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Media library</DialogTitle>
            <DialogDescription>
              Scroll to load more. Click a thumbnail to use it. Files over 1 MB
              are marked so you can download and replace them.
            </DialogDescription>
          </DialogHeader>
          {open ? (
            <MediaBrowser
              onSelect={(url) => {
                onSelect(url);
                setOpen(false);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
