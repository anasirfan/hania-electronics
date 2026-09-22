"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteSettings } from "@/domain/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => toast.error("Failed to load settings"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      setSettings(data.settings);
      toast.success("Store settings saved");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Loading settings…</p>;
  }

  function field<K extends keyof SiteSettings>(
    key: K,
    label: string,
    opts?: { type?: string },
  ) {
    const value = settings![key];
    if (typeof value !== "string") return null;
    return (
      <div className="space-y-1.5" key={String(key)}>
        <Label htmlFor={String(key)}>{label}</Label>
        <Input
          id={String(key)}
          type={opts?.type ?? "text"}
          value={value}
          onChange={(e) =>
            setSettings((s) => (s ? { ...s, [key]: e.target.value } : s))
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Store settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Contact, phones, address — shown on the website footer & contact page.
        </p>
      </div>

      <form
        onSubmit={(e) => void save(e)}
        className="space-y-6 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
      >
        <section className="grid gap-4 sm:grid-cols-2">
          {field("storeName", "Store name")}
          {field("email", "Email", { type: "email" })}
          {field("tagline", "Tagline")}
          {field("facebookUrl", "Facebook URL")}
        </section>

        <div className="space-y-1.5">
          <Label htmlFor="supportLine">Support line</Label>
          <Input
            id="supportLine"
            value={settings.supportLine}
            onChange={(e) =>
              setSettings({ ...settings, supportLine: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={settings.address}
            onChange={(e) =>
              setSettings({ ...settings, address: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mapUrl">Google Maps URL</Label>
          <Input
            id="mapUrl"
            value={settings.mapUrl}
            onChange={(e) =>
              setSettings({ ...settings, mapUrl: e.target.value })
            }
          />
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          {field("whatsapp", "WhatsApp (03…)")}
          {field("whatsappE164", "WhatsApp E.164 (92…)")}
          {field("phonePrimary", "Primary phone digits")}
          {field("phonePrimaryDisplay", "Primary phone display")}
          {field("phoneSecondary", "Secondary phone digits")}
          {field("phoneSecondaryDisplay", "Secondary phone display")}
          {field("phoneLandline", "Landline digits")}
          {field("phoneLandlineDisplay", "Landline display")}
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">Team contacts</h2>
          {settings.contacts.map((c, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Name"
                value={c.name}
                onChange={(e) => {
                  const contacts = [...settings.contacts];
                  contacts[i] = { ...c, name: e.target.value };
                  setSettings({ ...settings, contacts });
                }}
              />
              <Input
                placeholder="Display phone"
                value={c.phone}
                onChange={(e) => {
                  const contacts = [...settings.contacts];
                  contacts[i] = { ...c, phone: e.target.value };
                  setSettings({ ...settings, contacts });
                }}
              />
              <Input
                placeholder="Tel digits"
                value={c.tel}
                onChange={(e) => {
                  const contacts = [...settings.contacts];
                  contacts[i] = { ...c, tel: e.target.value };
                  setSettings({ ...settings, contacts });
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setSettings({
                ...settings,
                contacts: [
                  ...settings.contacts,
                  { name: "", phone: "", tel: "" },
                ],
              })
            }
          >
            Add contact
          </Button>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">Business hours</h2>
          {settings.businessHours.map((h, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Day"
                value={h.day}
                onChange={(e) => {
                  const businessHours = [...settings.businessHours];
                  businessHours[i] = { ...h, day: e.target.value };
                  setSettings({ ...settings, businessHours });
                }}
              />
              <Input
                placeholder="Hours"
                value={h.hours}
                onChange={(e) => {
                  const businessHours = [...settings.businessHours];
                  businessHours[i] = { ...h, hours: e.target.value };
                  setSettings({ ...settings, businessHours });
                }}
              />
            </div>
          ))}
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
