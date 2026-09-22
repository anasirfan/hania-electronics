"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Category, HomepageConfig, Product } from "@/domain/types";

function MultiSelect({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: { id: string; name: string }[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-white p-4">
      <p className="text-sm font-medium">{label}</p>
      <div className="max-h-48 space-y-1 overflow-y-auto text-sm">
        {options.map((o) => {
          const checked = values.includes(o.id);
          return (
            <label key={o.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  onChange(
                    checked
                      ? values.filter((id) => id !== o.id)
                      : [...values, o.id],
                  )
                }
              />
              {o.name}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminHomepagePage() {
  const [homepage, setHomepage] = React.useState<HomepageConfig | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    void Promise.all([
      fetch("/api/admin/homepage").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([h, p, c]) => {
      setHomepage(h.homepage);
      setProducts(p.products ?? []);
      setCategories(c.categories ?? []);
    });
  }, []);

  async function save() {
    if (!homepage) return;
    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(homepage),
    });
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    const data = await res.json();
    setHomepage(data.homepage);
    toast.success("Homepage merchandising saved");
  }

  if (!homepage) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const productOpts = products.map((p) => ({ id: p.id, name: p.name }));
  const categoryOpts = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Homepage</h1>
          <p className="text-sm text-muted-foreground">
            Merchandising picks and section visibility.
          </p>
        </div>
        <Button onClick={() => void save()}>Save</Button>
      </div>

      <div className="flex flex-wrap gap-4 rounded-2xl border border-border bg-white p-4 text-sm">
        {(
          Object.keys(homepage.sections) as Array<keyof HomepageConfig["sections"]>
        ).map((key) => (
          <label key={key} className="inline-flex items-center gap-2 capitalize">
            <input
              type="checkbox"
              checked={homepage.sections[key]}
              onChange={(e) =>
                setHomepage({
                  ...homepage,
                  sections: { ...homepage.sections, [key]: e.target.checked },
                })
              }
            />
            {key.replace(/([A-Z])/g, " $1")}
          </label>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MultiSelect
          label="Featured categories"
          options={categoryOpts}
          values={homepage.featuredCategoryIds}
          onChange={(featuredCategoryIds) =>
            setHomepage({ ...homepage, featuredCategoryIds })
          }
        />
        <MultiSelect
          label="Featured products"
          options={productOpts}
          values={homepage.featuredProductIds}
          onChange={(featuredProductIds) =>
            setHomepage({ ...homepage, featuredProductIds })
          }
        />
        <MultiSelect
          label="Popular picks"
          options={productOpts}
          values={homepage.bestSellerProductIds}
          onChange={(bestSellerProductIds) =>
            setHomepage({ ...homepage, bestSellerProductIds })
          }
        />
        <MultiSelect
          label="New arrivals"
          options={productOpts}
          values={homepage.newArrivalProductIds}
          onChange={(newArrivalProductIds) =>
            setHomepage({ ...homepage, newArrivalProductIds })
          }
        />
        <MultiSelect
          label="Sale products"
          options={productOpts}
          values={homepage.saleProductIds}
          onChange={(saleProductIds) =>
            setHomepage({ ...homepage, saleProductIds })
          }
        />
      </div>
    </div>
  );
}
