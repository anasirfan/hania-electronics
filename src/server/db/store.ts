import { promises as fs } from "fs";
import path from "path";
import { seedCategories } from "@/data/seed/categories";
import { seedProducts } from "@/data/seed/products";
import {
  seedAnnouncement,
  seedBanners,
  seedHomepage,
  seedOrders,
} from "@/data/seed/cms";
import type {
  AnnouncementBar,
  Banner,
  Category,
  HomepageConfig,
  Order,
  Product,
} from "@/domain/types";

export type StoreShape = {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  announcement: AnnouncementBar;
  homepage: HomepageConfig;
  orders: Order[];
};

const RUNTIME_DIR = path.join(process.cwd(), "data", "runtime");
const STORE_FILE = path.join(RUNTIME_DIR, "store.json");

function defaultStore(): StoreShape {
  return {
    categories: structuredClone(seedCategories),
    products: structuredClone(seedProducts),
    banners: structuredClone(seedBanners),
    announcement: structuredClone(seedAnnouncement),
    homepage: structuredClone(seedHomepage),
    orders: structuredClone(seedOrders),
  };
}

let writeQueue: Promise<void> = Promise.resolve();

export async function ensureStore(): Promise<StoreShape> {
  await fs.mkdir(RUNTIME_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    return JSON.parse(raw) as StoreShape;
  } catch {
    const store = defaultStore();
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
    return store;
  }
}

export async function readStore(): Promise<StoreShape> {
  return ensureStore();
}

export async function writeStore(store: StoreShape): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(RUNTIME_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
  });
  await writeQueue;
}

export async function updateStore(
  updater: (store: StoreShape) => StoreShape | Promise<StoreShape>,
): Promise<StoreShape> {
  const current = await readStore();
  const next = await updater(structuredClone(current));
  await writeStore(next);
  return next;
}

export async function resetStore(): Promise<StoreShape> {
  const store = defaultStore();
  await writeStore(store);
  return store;
}
