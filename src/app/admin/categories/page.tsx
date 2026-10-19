"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TogglePill } from "@/features/admin/toggle-switch";
import type { AboutBanner, Category } from "@/domain/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const blank = {
  name: "",
  slug: "",
  description: "",
  image: null as string | null,
  featured: false,
  sortOrder: 0,
  active: true,
};

function emptyBanner(): AboutBanner {
  return {
    id: `cat-banner-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    desktopImage: "",
    mobileImage: "",
    alt: "",
  };
}

async function uploadBannerFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", "categories");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json();
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  return data.url as string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [bannersByCategory, setBannersByCategory] = React.useState<
    Record<string, AboutBanner[]>
  >({});
  const [form, setForm] = React.useState(blank);
  const [banners, setBanners] = React.useState<AboutBanner[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const [catRes, bannerRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/category-banners"),
    ]);
    const data = await catRes.json();
    const bannerData = await bannerRes.json();
    setCategories(data.categories ?? []);
    setBannersByCategory(bannerData.banners ?? {});
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function upload(file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "categories");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }
    const data = await res.json();
    setForm((f) => ({ ...f, image: data.url }));
  }

  function bannersFor(c: Category): AboutBanner[] {
    const saved = bannersByCategory[c.id];
    if (saved && saved.length > 0) return saved.map((b) => ({ ...b }));
    if (c.image) {
      return [
        {
          id: `${c.id}-image`,
          desktopImage: c.image,
          mobileImage: c.image,
          alt: c.name,
        },
      ];
    }
    return [];
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      featured: c.featured,
      sortOrder: c.sortOrder,
      active: c.active,
    });
    setBanners(bannersFor(c));
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
    setBanners([]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and slug required");
      return;
    }
    const res = await fetch(
      editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    const saved = await res.json();
    const categoryId = (saved.category?.id as string | undefined) ?? editingId;
    if (categoryId) {
      const bannerRes = await fetch("/api/admin/category-banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          banners: banners.filter((b) => b.desktopImage),
        }),
      });
      if (!bannerRes.ok) {
        toast.error("Category saved, but the banner did not save");
        void load();
        return;
      }
    }
    toast.success(editingId ? "Category updated" : "Category created");
    reset();
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    void load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Mega menu and shop navigation are driven by these categories.
        </p>
      </div>

      <form
        onSubmit={save}
        className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: editingId ? f.slug : slugify(e.target.value),
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
            }
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
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
        <div className="flex flex-wrap items-end gap-2">
          <TogglePill
            label="Active"
            checked={form.active}
            onChange={(active) => setForm((f) => ({ ...f, active }))}
          />
          <TogglePill
            label="Featured"
            checked={form.featured}
            onChange={(featured) => setForm((f) => ({ ...f, featured }))}
          />
        </div>
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center gap-3">
            <Label>Card image</Label>
            <label className="cursor-pointer text-sm text-primary">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
            </label>
          </div>
          {form.image ? (
            <div className="relative h-28 w-40 overflow-hidden rounded-xl bg-accent">
              <Image src={form.image} alt="" fill className="object-cover" />
            </div>
          ) : null}
        </div>
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label>Category page banner</Label>
              <p className="text-xs text-muted-foreground">
                Shown at the top of this category, like the homepage and About
                heroes. Desktop and mobile can be different. Add more than one
                to rotate them.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBanners((list) => [...list, emptyBanner()])}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add banner
            </Button>
          </div>
          {banners.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No banner yet. The card image is used until you upload one.
            </p>
          ) : (
            banners.map((banner, index) => (
              <div
                key={banner.id}
                className="grid gap-3 rounded-xl border border-border bg-[#F8FAFC] p-3 sm:grid-cols-2"
              >
                {(
                  [
                    ["desktopImage", "Desktop"],
                    ["mobileImage", "Mobile"],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{label}</span>
                      <label className="cursor-pointer text-xs font-medium text-primary">
                        {banner[field] ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            void uploadBannerFile(file)
                              .then((url) => {
                                setBanners((list) =>
                                  list.map((b, i) =>
                                    i === index ? { ...b, [field]: url } : b,
                                  ),
                                );
                                toast.success(`${label} uploaded`);
                              })
                              .catch(() => toast.error("Upload failed"));
                          }}
                        />
                      </label>
                    </div>
                    <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-white shadow-[inset_0_0_0_1px_rgba(11,18,32,0.08)]">
                      {banner[field] ? (
                        <Image
                          src={banner[field]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Input
                    placeholder="Image description"
                    value={banner.alt}
                    onChange={(e) =>
                      setBanners((list) =>
                        list.map((b, i) =>
                          i === index ? { ...b, alt: e.target.value } : b,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:bg-white disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() =>
                      setBanners((list) => {
                        const next = [...list];
                        const tmp = next[index - 1];
                        next[index - 1] = next[index];
                        next[index] = tmp;
                        return next;
                      })
                    }
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:bg-white disabled:opacity-30"
                    disabled={index === banners.length - 1}
                    onClick={() =>
                      setBanners((list) => {
                        const next = [...list];
                        const tmp = next[index + 1];
                        next[index + 1] = next[index];
                        next[index] = tmp;
                        return next;
                      })
                    }
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      setBanners((list) => list.filter((_, i) => i !== index))
                    }
                    aria-label="Remove banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit">
            {editingId ? "Update category" : "Create category"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#F8FAFC] text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-accent">
                      {c.image ? (
                        <Image src={c.image} alt="" fill className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3">{c.active ? "Active" : "Hidden"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-primary"
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-destructive"
                      onClick={() => void remove(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
