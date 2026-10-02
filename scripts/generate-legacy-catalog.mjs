import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const m = JSON.parse(
  readFileSync(path.join(root, "scripts/.catalog-manifest.json"), "utf8"),
);
const esc = (s) => JSON.stringify(s);
const idMap = {
  "cat-light-your-night": "light-your-night",
  "cat-voco-premium": "voco-premium-accessories",
  "cat-style-care": "style-care",
  "cat-smart-living": "smart-living",
};
const purposeByCat = {
  "light-your-night": ["home", "emergency", "office"],
  "voco-premium-accessories": ["home", "office", "travel"],
  "style-care": ["home", "travel"],
  "smart-living": ["home", "office"],
};

let out = `import type { Category } from "@/features/products/types";

export const categories: Category[] = [
`;
for (const c of m.categories) {
  out += `  {
    id: ${esc(idMap[c.id])},
    name: ${esc(c.name)},
    description: ${esc(c.description)},
    image: ${esc(c.image)},
  },
`;
}
out += `];
`;
writeFileSync(path.join(root, "src/data/catalog/categories.ts"), out);

let pout = `import type { Product } from "@/features/products/types";

export const products: Product[] = [
`;
for (const p of m.products) {
  const cat = idMap[p.categoryId];
  const primary =
    (p.images || []).find((i) => i.isPrimary) || (p.images || [])[0];
  const badge = p.bestSeller ? "bestseller" : p.newArrival ? "new" : null;
  pout += `  {
    id: ${esc(p.id)},
    slug: ${esc(p.slug)},
    name: ${esc(p.name)},
    description: ${esc(p.shortDescription)},
    pricePkr: ${p.price},
    image: ${esc(primary?.url || null)},
    category: ${esc(cat)},
    purposes: ${JSON.stringify(purposeByCat[cat] || ["home"])},
`;
  if (badge) pout += `    badge: ${esc(badge)},\n`;
  pout += `    inStock: true,
    featured: ${Boolean(p.featured)},
    bestseller: ${Boolean(p.bestSeller)},
    features: ${JSON.stringify(p.features)},
  },
`;
}
pout += `];
`;
writeFileSync(path.join(root, "src/data/catalog/products.ts"), pout);
console.log("legacy catalog written");
