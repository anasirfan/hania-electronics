import sharp from 'sharp';
import { statSync, writeFileSync } from 'fs';

const targets = [
  { src: 'public/scenes/garden-lantern.webp',  maxW: 1920, quality: 72 },
  { src: 'public/scenes/desk-lamp.webp',        maxW: 1920, quality: 72 },
  { src: 'public/categories/head-lamps.webp',   maxW: 1200, quality: 75 },
];

async function compress({ src, maxW, quality }) {
  try {
    const meta = await sharp(src).metadata();
    const before = statSync(src).size;

    let pipeline = sharp(src);
    if (meta.width > maxW) {
      pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true });
    }

    const buf = await pipeline.webp({ quality }).toBuffer();
    writeFileSync(src, buf);

    const after = buf.length;
    const saved = Math.round((1 - after / before) * 100);
    console.log(`✓ ${src.replace('public/', '')} — ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB  (${saved}% saved)`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
  }
}

for (const t of targets) {
  await compress(t);
}
