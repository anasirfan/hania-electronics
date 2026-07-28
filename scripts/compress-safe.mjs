import sharp from 'sharp';
import { statSync } from 'fs';

// Write to new filenames (no overwrite needed)
const targets = [
  { src: 'public/scenes/garden-lantern.webp',  out: 'public/scenes/garden-lantern-c.webp',  maxW: 1920, quality: 72 },
  { src: 'public/scenes/desk-lamp.webp',        out: 'public/scenes/desk-lamp-c.webp',        maxW: 1920, quality: 72 },
  { src: 'public/categories/head-lamps.webp',   out: 'public/categories/head-lamps-c.webp',   maxW: 1200, quality: 75 },
];

async function compress({ src, out, maxW, quality }) {
  try {
    const meta = await sharp(src).metadata();
    const before = statSync(src).size;

    let pipeline = sharp(src);
    if (meta.width > maxW) {
      pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true });
    }
    await pipeline.webp({ quality }).toFile(out);

    const after = statSync(out).size;
    const saved = Math.round((1 - after / before) * 100);
    console.log(`✓ ${out.replace('public/', '')} — ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB  (${saved}% saved)`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
  }
}

for (const t of targets) {
  await compress(t);
}
