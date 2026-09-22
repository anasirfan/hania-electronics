"use client";

import * as React from "react";
import { toast } from "sonner";

type SetupState = {
  backend: string;
  tablesReady: boolean;
  tablesError: string | null;
  schemaSql: string;
  projectUrl: string | null;
};

export default function AdminSetupPage() {
  const [state, setState] = React.useState<SetupState | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  const refresh = React.useCallback(() => {
    void fetch("/api/admin/setup")
      .then(async (r) => {
        if (!r.ok) throw new Error("Unauthorized or failed");
        return r.json();
      })
      .then(setState)
      .catch(() => setState(null));
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  async function copySchema() {
    if (!state?.schemaSql) return;
    await navigator.clipboard.writeText(state.schemaSql);
    toast.success("Schema SQL copied");
  }

  async function seed() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Seed failed");
        return;
      }
      setLog(data.logs ?? []);
      toast.success("Seeded into Supabase");
      refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!state) {
    return <p className="text-sm text-muted-foreground">Loading setup…</p>;
  }

  const projectRef =
    state.projectUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null;
  const editorUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : "https://supabase.com/dashboard";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Supabase setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Empty Sydney project — apply schema once, then seed catalog data.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
        <p className="text-sm">
          Backend: <span className="font-medium">{state.backend}</span>
        </p>
        <p className="text-sm">
          Tables:{" "}
          <span className="font-medium">
            {state.tablesReady ? "Ready" : "Missing"}
          </span>
        </p>
        {state.tablesError ? (
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            {state.tablesError}
          </p>
        ) : null}
        {state.projectUrl ? (
          <p className="text-xs text-muted-foreground break-all">
            {state.projectUrl}
          </p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-border bg-white p-5 space-y-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">1. Apply schema</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Open the SQL Editor, paste{" "}
            <code className="text-xs">supabase/schema.sql</code>, and Run.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={editorUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Open SQL Editor
          </a>
          <button
            type="button"
            onClick={() => void copySchema()}
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-sm font-medium"
          >
            Copy schema SQL
          </button>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-sm font-medium"
          >
            Recheck tables
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 space-y-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">2. Seed data</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pushes categories, products, banners, homepage, and sample orders
            from the local store into Supabase.
          </p>
        </div>
        <button
          type="button"
          disabled={busy || !state.tablesReady}
          onClick={() => void seed()}
          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Seeding…" : "Seed Supabase"}
        </button>
        {log.length ? (
          <ul className="text-xs text-muted-foreground space-y-1">
            {log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
