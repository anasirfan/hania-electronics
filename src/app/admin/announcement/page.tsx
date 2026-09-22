"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnnouncementBar } from "@/domain/types";

export default function AdminAnnouncementPage() {
  const [form, setForm] = React.useState<AnnouncementBar | null>(null);

  React.useEffect(() => {
    void fetch("/api/admin/announcement")
      .then((r) => r.json())
      .then((d) => setForm(d.announcement));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const res = await fetch("/api/admin/announcement", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    const data = await res.json();
    setForm(data.announcement);
    toast.success("Announcement saved");
  }

  if (!form) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Announcement bar</h1>
        <p className="text-sm text-muted-foreground">
          Promo strip shown above the storefront header.
        </p>
      </div>

      <form
        onSubmit={save}
        className="space-y-4 rounded-2xl border border-border bg-white p-5"
      >
        <div className="space-y-2">
          <Label>Text</Label>
          <Input
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Link (optional)</Label>
          <Input
            value={form.link ?? ""}
            onChange={(e) =>
              setForm({ ...form, link: e.target.value || null })
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Background</Label>
            <Input
              type="color"
              value={form.backgroundColor}
              onChange={(e) =>
                setForm({ ...form, backgroundColor: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Text color</Label>
            <Input
              type="color"
              value={form.textColor}
              onChange={(e) => setForm({ ...form, textColor: e.target.value })}
            />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
        <div>
          <Button type="submit">Save announcement</Button>
        </div>
      </form>
    </div>
  );
}
