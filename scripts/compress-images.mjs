import sharp from 'sharp';
import { statSync, renameSync, unlinkSync } from 'fs';
import { extname } from 'path';

const targets = [
  { src: 'public/scenes/headlamp-lifestyle.webp', maxW: 1920, quality: 72 },
  { src: 'public/scenes/garden-lantern.webp',     maxW: 1920, quality: 72 },
  { src: 'public/scenes/living-room-hero.webp',   maxW: 1920, quality: 72 },
  { src: 'public/scenes/desk-lamp.webp',          maxW: 1920, quality: 72 },
  { src: 'public/scenes/building-night.webp',     maxW: 1920, quality: 72 },
  { src: 'public/categories/head-lamps.webp',     maxW: 1200, quality: 75 },
  // JPG → convert to webp in-place (different extension so no conflict)
  { src: 'public/scenes/living-room-hero.jpg',    maxW: 1920, quality: 72, outFormat: 'webp', out: 'public/scenes/living-room-hero.webp' },
  { src: 'public/scenes/bedroom-warm.jpg',        maxW: 1920, quality: 72, outFormat: 'webp', out: 'public/scenes/bedroom-warm.webp' },
  { src: 'public/scenes/camping-night.jpg',       maxW: 1920, quality: 72, outFormat: 'webp', out: 'public/scenes/camping-night.webp' },
  { src: 'public/scenes/warehouse-showroom.jpg',  maxW: 1920, quality: 72, outFormat: 'webp', out: 'public/scenes/warehouse-showroom.webp' },
  { src: 'public/hero/living-room.jpg',           maxW: 1920, quality: 72, outFormat: 'webp', out: 'public/hero/living-room.webp' },
  { src: 'public/hero/banner-mid-section.jpg',    maxW: 1600, quality: 80, outFormat: 'webp', out: 'public/hero/banner-mid-section.webp' },
];

async function compress({ src, maxW, quality, outFormat, out }) {
  const tmp = (out ?? src) + '.tmp';
  const output = out ?? src;
  const ext = extname(output).slice(1);
  const format = outFormat ?? (ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'webp');

  try {
    const meta = await sharp(src).metadata();
    const before = statSync(src).size;

    let pipeline = sharp(src);
    if (meta.width > maxW) {
      pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true });
    }

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }

    await pipeline.toFile(tmp);
    renameSync(tmp, output);

    const after = statSync(output).size;
    const saved = Math.round((1 - after / before) * 100);
    console.log(`✓ ${output.replace('public/', '')} — ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB  (${saved}% saved)`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
    try { unlinkSync(tmp); } catch {}
  }
}

for (const t of targets) {
  await compress(t);
}

console.log('\nDone. Update media.ts references from .jpg → .webp where files were converted.');
