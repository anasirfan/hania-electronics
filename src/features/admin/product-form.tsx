"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, Product, ProductImage, StockStatus } from "@/domain/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type FormState = {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  compareAtPrice: number | null;
  stockQuantity: number;
  stockStatus: StockStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  saleBadge: boolean;
  published: boolean;
  features: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  images: ProductImage[];
};

const empty: FormState = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  price: 0,
  salePrice: null,
  compareAtPrice: null,
  stockQuantity: 0,
  stockStatus: "in_stock",
  featured: false,
  bestSeller: false,
  newArrival: false,
  saleBadge: false,
  published: true,
  features: "",
  tags: "",
  seoTitle: "",
  seoDescription: "",
  images: [],
};

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState<FormState>(empty);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(Boolean(productId));

  React.useEffect(() => {
    void fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  React.useEffect(() => {
    if (!productId) return;
    void fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.product as Product;
        if (!p) return;
        setForm({
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          categoryId: p.categoryId,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          salePrice: p.salePrice,
          compareAtPrice: p.compareAtPrice,
          stockQuantity: p.stockQuantity,
          stockStatus: p.stockStatus,
          featured: p.featured,
          bestSeller: p.bestSeller,
          newArrival: p.newArrival,
          saleBadge: p.saleBadge,
          published: p.published,
          features: p.features.join("\n"),
          tags: p.tags.join(", "),
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          images: p.images,
        });
        setLoading(false);
      });
  }, [productId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "products");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }
    const data = await res.json();
    const image: ProductImage = {
      id: `img-${Date.now()}`,
      url: data.url,
      sortOrder: form.images.length,
      isPrimary: form.images.length === 0,
    };
    set("images", [...form.images, image]);
  }

  function setPrimary(id: string) {
    set(
      "images",
      form.images.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  }

  function moveImage(index: number, dir: -1 | 1) {
    const next = [...form.images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    set(
      "images",
      next.map((img, i) => ({ ...img, sortOrder: i })),
    );
  }

  function removeImage(id: string) {
    const next = form.images.filter((i) => i.id !== id);
    if (next.length && !next.some((i) => i.isPrimary)) {
      next[0].isPrimary = true;
    }
    set(
      "images",
      next.map((img, i) => ({ ...img, sortOrder: i })),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug || !form.sku || !form.categoryId) {
      toast.error("Name, slug, SKU, and category are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      categoryId: form.categoryId,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice == null || form.salePrice === 0 ? null : Number(form.salePrice),
      compareAtPrice:
        form.compareAtPrice == null || form.compareAtPrice === 0
          ? null
          : Number(form.compareAtPrice),
      stockQuantity: Number(form.stockQuantity),
      stockStatus: form.stockStatus,
      featured: form.featured,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      saleBadge: form.saleBadge,
      manualBadges: [],
      images: form.images,
      specifications: {},
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      seoTitle: form.seoTitle || form.name,
      seoDescription: form.seoDescription || form.shortDescription,
      published: form.published,
    };

    const res = await fetch(
      productId ? `/api/admin/products/${productId}` : "/api/admin/products",
      {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success(productId ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading product…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {productId ? "Edit product" : "New product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Catalog item with images, pricing, and publish state.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </Button>
      </div>

      <section className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!productId) set("slug", slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockStatus">Stock status</Label>
          <select
            id="stockStatus"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.stockStatus}
            onChange={(e) => set("stockStatus", e.target.value as StockStatus)}
          >
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="preorder">Preorder</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="short">Short description</Label>
          <Input
            id="short"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="desc">Description</Label>
          <textarea
            id="desc"
            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Price (PKR)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Sale price</Label>
          <Input
            type="number"
            value={form.salePrice ?? ""}
            onChange={(e) =>
              set("salePrice", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Compare at</Label>
          <Input
            type="number"
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              set(
                "compareAtPrice",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Stock qty</Label>
          <Input
            type="number"
            value={form.stockQuantity}
            onChange={(e) => set("stockQuantity", Number(e.target.value))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Images</h2>
          <label className="cursor-pointer text-sm font-medium text-primary">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadImage(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {form.images.map((img, index) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-border"
            >
              <div className="relative aspect-square bg-accent">
                <Image src={img.url} alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-wrap gap-2 p-2 text-xs">
                <button type="button" onClick={() => setPrimary(img.id)}>
                  {img.isPrimary ? "Primary" : "Make primary"}
                </button>
                <button type="button" onClick={() => moveImage(index, -1)}>
                  ↑
                </button>
                <button type="button" onClick={() => moveImage(index, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className="text-destructive"
                  onClick={() => removeImage(img.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Features (one per line)</Label>
          <textarea
            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Tags (comma separated)</Label>
          <Input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
          />
          <Label className="mt-4 block">SEO title</Label>
          <Input
            value={form.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
          />
          <Label className="mt-4 block">SEO description</Label>
          <textarea
            className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-4 rounded-2xl border border-border bg-white p-5 text-sm">
        {(
          [
            ["published", "Published"],
            ["featured", "Featured"],
            ["bestSeller", "Popular pick"],
            ["newArrival", "New arrival"],
            ["saleBadge", "Sale badge"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => set(key, e.target.checked)}
            />
            {label}
          </label>
        ))}
      </section>
    </form>
  );
}
