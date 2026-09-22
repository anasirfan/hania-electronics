"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/domain/types";

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState(blank);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
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
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
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
        <div className="flex flex-wrap items-end gap-4">
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
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured: e.target.checked }))
              }
            />
            Featured
          </label>
        </div>
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center gap-3">
            <Label>Image</Label>
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
