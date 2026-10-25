"use client";

import * as React from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TogglePill } from "@/features/admin/toggle-switch";
import { MediaLibraryButton } from "@/features/admin/media-browser";
import type { AboutContent } from "@/domain/types";

type ListKey = "stats" | "timeline" | "values" | "network" | "banners";

function BannerImageField({
  label,
  url,
  onUploaded,
}: {
  label: string;
  url: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = React.useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "about");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      onUploaded(data.url as string);
      toast.success(`${label} uploaded`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-sm font-medium text-primary">
            {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.target.value = "";
              }}
            />
          </label>
          <MediaLibraryButton onSelect={onUploaded} />
        </div>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#F4F6F9] shadow-[inset_0_0_0_1px_rgba(11,18,32,0.08)]">
        {url ? (
          <Image src={url} alt="" fill className="object-cover" sizes="400px" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No image yet
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminAboutPage() {
  const [about, setAbout] = React.useState<AboutContent | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void fetch("/api/admin/about")
      .then((r) => r.json())
      .then((d) => setAbout(d.about))
      .catch(() => toast.error("Failed to load About page content"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      setAbout(data.about);
      toast.success("About page saved");
    } finally {
      setSaving(false);
    }
  }

  if (!about) {
    return <p className="text-sm text-muted-foreground">Loading About page…</p>;
  }

  const a = about;
  const patch = (p: Partial<AboutContent>) => setAbout({ ...a, ...p });

  function text<K extends keyof AboutContent>(
    key: K,
    label: string,
    opts?: { multiline?: boolean; hint?: string; rows?: number },
  ) {
    const value = a[key];
    if (typeof value !== "string") return null;
    return (
      <div className="space-y-1.5" key={String(key)}>
        <Label htmlFor={String(key)}>{label}</Label>
        {opts?.multiline ? (
          <Textarea
            id={String(key)}
            rows={opts.rows ?? 3}
            className="min-h-0 bg-background"
            value={value}
            onChange={(e) => patch({ [key]: e.target.value } as Partial<AboutContent>)}
          />
        ) : (
          <Input
            id={String(key)}
            value={value}
            onChange={(e) => patch({ [key]: e.target.value } as Partial<AboutContent>)}
          />
        )}
        {opts?.hint && (
          <p className="text-xs text-muted-foreground">{opts.hint}</p>
        )}
      </div>
    );
  }

  function moveItem<K extends ListKey>(key: K, index: number, dir: -1 | 1) {
    const list = [...a[key]] as AboutContent[K];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const tmp = list[index];
    list[index] = list[target];
    list[target] = tmp;
    patch({ [key]: list } as Partial<AboutContent>);
  }

  function removeItem<K extends ListKey>(key: K, index: number) {
    const list = (a[key] as unknown[]).filter((_, i) => i !== index);
    patch({ [key]: list } as Partial<AboutContent>);
  }

  function updateItem<K extends ListKey>(
    key: K,
    index: number,
    value: Partial<AboutContent[K][number]>,
  ) {
    const list = [...a[key]] as AboutContent[K];
    list[index] = { ...list[index], ...value } as AboutContent[K][number];
    patch({ [key]: list } as Partial<AboutContent>);
  }

  function addItem<K extends ListKey>(key: K, item: AboutContent[K][number]) {
    patch({ [key]: [...a[key], item] } as Partial<AboutContent>);
  }

  function RowTools({ k, i, len }: { k: ListKey; i: number; len: number }) {
    return (
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
          disabled={i === 0}
          onClick={() => moveItem(k, i, -1)}
          aria-label="Move up"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
          disabled={i === len - 1}
          onClick={() => moveItem(k, i, 1)}
          aria-label="Move down"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => removeItem(k, i)}
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const card = "space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6";
  const cardTitle = "font-heading text-lg font-semibold";
  const row = "rounded-xl border border-border/70 bg-background/60 p-3";

  return (
    <form onSubmit={(e) => void save(e)} className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            About page
          </h1>
          <p className="text-sm text-muted-foreground">
            Every line of copy on <code>/about</code>. Use a line break in
            headings to control where the title wraps.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save About page"}
        </Button>
      </div>

      {/* SEO */}
      <section className={card}>
        <h2 className={cardTitle}>SEO</h2>
        {text("metaTitle", "Browser / search title")}
        {text("metaDescription", "Meta description", { multiline: true, rows: 2 })}
      </section>

      {/* Hero */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={cardTitle}>Hero banners</h2>
            <p className="text-xs text-muted-foreground">
              Same as the homepage: desktop and mobile images, in the order they
              should slide. More than one banner rotates automatically.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addItem("banners", {
                id: `about-banner-${Date.now()}`,
                desktopImage: "",
                mobileImage: "",
                alt: "",
              })
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add banner
          </Button>
        </div>
        <div className="space-y-3">
          {a.banners.map((banner, i) => (
            <div key={banner.id || i} className={`${row} flex items-start gap-3`}>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <BannerImageField
                  label="Desktop image"
                  url={banner.desktopImage}
                  onUploaded={(desktopImage) =>
                    updateItem("banners", i, { desktopImage })
                  }
                />
                <BannerImageField
                  label="Mobile image"
                  url={banner.mobileImage}
                  onUploaded={(mobileImage) =>
                    updateItem("banners", i, { mobileImage })
                  }
                />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Image description (alt text)</Label>
                  <Input
                    placeholder="What the photo shows"
                    value={banner.alt}
                    onChange={(e) => updateItem("banners", i, { alt: e.target.value })}
                  />
                </div>
              </div>
              <RowTools k="banners" i={i} len={a.banners.length} />
            </div>
          ))}
          {a.banners.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No banners yet. Add one to show a photo behind the hero text.
            </p>
          )}
        </div>
        {text("heroEyebrow", "Eyebrow (small label)")}
        {text("heroTitle", "Headline", { multiline: true, rows: 2 })}
        {text("heroBody", "Intro paragraph", { multiline: true, rows: 3 })}
      </section>

      {/* Stats */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>Stats bar</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("stats", { value: "", label: "" })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add stat
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {a.stats.map((s, i) => (
            <div key={i} className={`${row} flex items-start gap-2`}>
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="Value (e.g. 15k+)"
                  value={s.value}
                  onChange={(e) => updateItem("stats", i, { value: e.target.value })}
                />
                <Input
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => updateItem("stats", i, { label: e.target.value })}
                />
              </div>
              <RowTools k="stats" i={i} len={a.stats.length} />
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>Who we are</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => patch({ storyParagraphs: [...a.storyParagraphs, ""] })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add paragraph
          </Button>
        </div>
        {text("storyEyebrow", "Eyebrow")}
        {text("storyTitle", "Heading", { multiline: true, rows: 2 })}
        <div className="space-y-3">
          <Label>Paragraphs</Label>
          {a.storyParagraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <Textarea
                rows={3}
                className="min-h-0 bg-background"
                value={p}
                onChange={(e) => {
                  const storyParagraphs = [...a.storyParagraphs];
                  storyParagraphs[i] = e.target.value;
                  patch({ storyParagraphs });
                }}
              />
              <button
                type="button"
                className="mt-1 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() =>
                  patch({
                    storyParagraphs: a.storyParagraphs.filter((_, j) => j !== i),
                  })
                }
                aria-label="Remove paragraph"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>Our journey (timeline)</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("timeline", { year: "", title: "", body: "" })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add milestone
          </Button>
        </div>
        {text("timelineEyebrow", "Eyebrow")}
        {text("timelineTitle", "Heading", { multiline: true, rows: 2 })}
        <div className="space-y-3">
          {a.timeline.map((t, i) => (
            <div key={i} className={`${row} flex items-start gap-2`}>
              <div className="grid flex-1 gap-2 sm:grid-cols-[110px_1fr]">
                <Input
                  placeholder="Year"
                  value={t.year}
                  onChange={(e) => updateItem("timeline", i, { year: e.target.value })}
                />
                <Input
                  placeholder="Title"
                  value={t.title}
                  onChange={(e) => updateItem("timeline", i, { title: e.target.value })}
                />
                <Textarea
                  rows={2}
                  placeholder="Description"
                  className="min-h-0 bg-background sm:col-span-2"
                  value={t.body}
                  onChange={(e) => updateItem("timeline", i, { body: e.target.value })}
                />
              </div>
              <RowTools k="timeline" i={i} len={a.timeline.length} />
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>Our values</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("values", { title: "", body: "" })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add value
          </Button>
        </div>
        {text("valuesEyebrow", "Eyebrow")}
        {text("valuesTitle", "Heading")}
        <div className="space-y-3">
          {a.values.map((v, i) => (
            <div key={i} className={`${row} flex items-start gap-2`}>
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="Title"
                  value={v.title}
                  onChange={(e) => updateItem("values", i, { title: e.target.value })}
                />
                <Textarea
                  rows={2}
                  placeholder="Description"
                  className="min-h-0 bg-background"
                  value={v.body}
                  onChange={(e) => updateItem("values", i, { body: e.target.value })}
                />
              </div>
              <RowTools k="values" i={i} len={a.values.length} />
            </div>
          ))}
        </div>
      </section>

      {/* Reach */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>Our reach (cities)</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("network", { city: "", role: "", primary: false })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add city
          </Button>
        </div>
        {text("reachEyebrow", "Eyebrow")}
        {text("reachTitle", "Heading", { multiline: true, rows: 2 })}
        {text("reachBody", "Paragraph", { multiline: true, rows: 3 })}
        <div className="grid gap-3 sm:grid-cols-2">
          {a.network.map((n, i) => (
            <div key={i} className={`${row} flex items-start gap-2`}>
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="City"
                  value={n.city}
                  onChange={(e) => updateItem("network", i, { city: e.target.value })}
                />
                <Input
                  placeholder="Role (e.g. Delivery coverage)"
                  value={n.role}
                  onChange={(e) => updateItem("network", i, { role: e.target.value })}
                />
                <TogglePill
                  label="Highlight (HQ)"
                  checked={n.primary}
                  onChange={(primary) => updateItem("network", i, { primary })}
                  className="w-fit"
                />
              </div>
              <RowTools k="network" i={i} len={a.network.length} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={card}>
        <h2 className={cardTitle}>Bottom call-to-action</h2>
        {text("ctaTitle", "Heading")}
        {text("ctaBody", "Sub text")}
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save About page"}
        </Button>
      </div>
    </form>
  );
}
