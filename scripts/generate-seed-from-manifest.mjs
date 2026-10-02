/**
 * Generate src/data/seed/{categories,products,cms}.ts from scripts/.catalog-manifest.json
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const m = JSON.parse(
  readFileSync(path.join(root, "scripts/.catalog-manifest.json"), "utf8"),
);
const now = m.categories[0]?.createdAt || new Date().toISOString();
const esc = (s) => JSON.stringify(s);

let catsOut = `import type { Category } from "@/domain/types";

const now = ${esc(now)};

export const seedCategories: Category[] = [
`;
for (const c of m.categories) {
  catsOut += `  {
    id: ${esc(c.id)},
    name: ${esc(c.name)},
    slug: ${esc(c.slug)},
    description: ${esc(c.description)},
    image: ${esc(c.image)},
    featured: true,
    sortOrder: ${c.sortOrder},
    active: true,
    createdAt: now,
    updatedAt: now,
  },
`;
}
catsOut += `];
`;
writeFileSync(path.join(root, "src/data/seed/categories.ts"), catsOut);

let prodOut = `import type { Product, ProductImage } from "@/domain/types";

const now = ${esc(now)};

function img(
  id: string,
  url: string,
  sortOrder = 0,
  isPrimary = false,
  alt = "",
): ProductImage {
  return { id, url, sortOrder, isPrimary, alt };
}

export const seedProducts: Product[] = [
`;
for (const p of m.products) {
  prodOut += `  {
    id: ${esc(p.id)},
    name: ${esc(p.name)},
    slug: ${esc(p.slug)},
    sku: ${esc(p.sku)},
    categoryId: ${esc(p.categoryId)},
    shortDescription: ${esc(p.shortDescription)},
    description: ${esc(p.description)},
    price: ${p.price},
    salePrice: null,
    compareAtPrice: null,
    stockQuantity: 50,
    stockStatus: "in_stock",
    featured: ${Boolean(p.featured)},
    bestSeller: ${Boolean(p.bestSeller)},
    newArrival: ${Boolean(p.newArrival)},
    saleBadge: false,
    manualBadges: [],
    images: [
`;
  for (const im of p.images) {
    prodOut += `      img(${esc(im.id)}, ${esc(im.url)}, ${im.sortOrder}, ${Boolean(im.isPrimary)}, ${esc(im.alt || "")}),
`;
  }
  prodOut += `    ],
    specifications: ${JSON.stringify(p.specifications, null, 6).replace(/\n/g, "\n    ")},
    features: ${JSON.stringify(p.features)},
    tags: ${JSON.stringify(p.tags)},
    seoTitle: ${esc(`${p.name} | HANIA Electronics`)},
    seoDescription: ${esc(p.shortDescription)},
    published: true,
    createdAt: now,
    updatedAt: now,
  },
`;
}
prodOut += `];
`;
writeFileSync(path.join(root, "src/data/seed/products.ts"), prodOut);

const featured = m.products.filter((p) => p.featured).map((p) => p.id);
const best = m.products.filter((p) => p.bestSeller).map((p) => p.id);
const all = m.products.map((p) => p.id);
const catIds = m.categories.map((c) => c.id);

const cmsPath = path.join(root, "src/data/seed/cms.ts");
let cms = readFileSync(cmsPath, "utf8");
cms = cms.replace(
  /featuredCategoryIds:\s*\[[\s\S]*?\],/,
  `featuredCategoryIds: [\n${catIds.map((id) => `    ${esc(id)},`).join("\n")}\n  ],`,
);
cms = cms.replace(
  /featuredProductIds:\s*\[[\s\S]*?\],/,
  `featuredProductIds: [\n${featured.map((id) => `    ${esc(id)},`).join("\n")}\n  ],`,
);
cms = cms.replace(
  /bestSellerProductIds:\s*\[[\s\S]*?\],/,
  `bestSellerProductIds: [\n${best.map((id) => `    ${esc(id)},`).join("\n")}\n  ],`,
);
cms = cms.replace(
  /newArrivalProductIds:\s*\[[\s\S]*?\],/,
  `newArrivalProductIds: [\n${all.map((id) => `    ${esc(id)},`).join("\n")}\n  ],`,
);
cms = cms.replace(
  /saleProductIds:\s*\[[\s\S]*?\],/,
  `saleProductIds: [],`,
);
cms = cms.replace(
  /sale:\s*true,/,
  `sale: false,`,
);
cms = cms.replace(
  /text: "20% OFF ON SELECTED PRODUCTS — SHOP NOW"/,
  `text: "NEW ARRIVALS — LIGHT YOUR NIGHT & VOCO PREMIUM"`,
);
cms = cms.replace(
  /subtitle: "Flash lights, metal lights & solar — ready for Pakistani homes."/,
  `subtitle: "Light Your Night, VOCO accessories, Style & Care, and Smart Living."`,
);
cms = cms.replace(
  /ctaLink: "\/shop\/solar-lights"/,
  `ctaLink: "/shop/light-your-night"`,
);
cms = cms.replace(
  /title: "Solar nights, brighter savings"/,
  `title: "Light your night, stay powered"`,
);
cms = cms.replace(
  /subtitle: "Explore rechargeable solar lanterns and outdoor lights."/,
  `subtitle: "Rechargeable bulbs and VOCO premium accessories — ready for Pakistani homes."`,
);
writeFileSync(cmsPath, cms);

console.log("Updated seed categories, products, cms");
