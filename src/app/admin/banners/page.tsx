"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Banner } from "@/domain/types";

const blank = {
  title: "",
  subtitle: "",
  ctaText: "Shop Now",
  ctaLink: "/shop",
  desktopImage: "",
  mobileImage: "",
  active: true,
  sortOrder: 0,
  startDate: null as string | null,
  endDate: null as string | null,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [form, setForm] = React.useState(blank);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(data.banners ?? []);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function upload(file: File, field: "desktopImage" | "mobileImage") {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "banners");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }
    const data = await res.json();
    setForm((f) => ({ ...f, [field]: data.url }));
  }

  function startEdit(b: Banner) {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      desktopImage: b.desktopImage,
      mobileImage: b.mobileImage,
      active: b.active,
      sortOrder: b.sortOrder,
      startDate: b.startDate,
      endDate: b.endDate,
    });
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.desktopImage) {
      toast.error("Title and desktop image required");
      return;
    }
    const res = await fetch(
      editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          mobileImage: form.mobileImage || form.desktopImage,
        }),
      },
    );
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success(editingId ? "Banner updated" : "Banner created");
    reset();
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Delete banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    void load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground">
          Hero carousel with desktop and mobile assets.
        </p>
      </div>

      <form
        onSubmit={save}
        className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={form.subtitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, subtitle: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>CTA text</Label>
          <Input
            value={form.ctaText}
            onChange={(e) =>
              setForm((f) => ({ ...f, ctaText: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>CTA link</Label>
          <Input
            value={form.ctaLink}
            onChange={(e) =>
              setForm((f) => ({ ...f, ctaLink: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
            }
          />
        </div>
        <div className="flex items-end gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            Active
          </label>
        </div>
        <div className="space-y-2">
          <Label>Start date</Label>
          <Input
            type="date"
            value={form.startDate?.slice(0, 10) ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>End date</Label>
          <Input
            type="date"
            value={form.endDate?.slice(0, 10) ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
              }))
            }
          />
        </div>
        {(
          [
            ["desktopImage", "Desktop image"],
            ["mobileImage", "Mobile image"],
          ] as const
        ).map(([field, label]) => (
          <div key={field} className="space-y-2">
            <div className="flex items-center gap-3">
              <Label>{label}</Label>
              <label className="cursor-pointer text-sm text-primary">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file, field);
                  }}
                />
              </label>
            </div>
            {form[field] ? (
              <div className="relative h-28 w-full overflow-hidden rounded-xl bg-accent">
                <Image src={form[field]} alt="" fill className="object-cover" />
              </div>
            ) : null}
          </div>
        ))}
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit">
            {editingId ? "Update banner" : "Create banner"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-accent">
                <Image src={b.desktopImage} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">
                  Sort {b.sortOrder} · {b.active ? "Active" : "Off"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button type="button" className="text-primary" onClick={() => startEdit(b)}>
                Edit
              </button>
              <button
                type="button"
                className="text-destructive"
                onClick={() => void remove(b.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
