/**
 * Apply supabase/schema.sql via Postgres connection.
 * Requires DATABASE_URL in .env.local (Dashboard → Database → URI).
 *
 * Usage: npm run db:schema
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const raw = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i === -1) continue;
    const key = line.slice(0, i);
    const value = line.slice(i + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "1. Supabase Dashboard → Project Settings → Database\n" +
      "2. Copy the URI (Session mode) into .env.local as DATABASE_URL=...\n" +
      "3. Re-run: npm run db:schema\n\n" +
      "Or paste supabase/schema.sql in the SQL Editor once.",
  );
  process.exit(1);
}

let pg;
try {
  pg = require("pg");
} catch {
  console.error("Install pg first: npm install -D pg");
  process.exit(1);
}

const sql = readFileSync(path.join(root, "supabase", "schema.sql"), "utf8");
const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  await client.query(sql);
  console.log("Schema applied successfully.");
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await client.end();
  } catch {
    // ignore
  }
  process.exit(1);
});
