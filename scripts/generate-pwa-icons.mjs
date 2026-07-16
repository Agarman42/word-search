import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

async function renderSvg(svgPath, size, outPath) {
  const svg = readFileSync(svgPath);
  await sharp(svg, { density: Math.ceil((size / 512) * 144) })
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`Wrote ${outPath}`);
}

await renderSvg(join(publicDir, 'pwa-icon.svg'), 192, join(publicDir, 'pwa-192.png'));
await renderSvg(join(publicDir, 'pwa-icon.svg'), 512, join(publicDir, 'pwa-512.png'));
await renderSvg(join(publicDir, 'pwa-icon-maskable.svg'), 512, join(publicDir, 'pwa-512-maskable.png'));

// Apple touch icon
await renderSvg(join(publicDir, 'pwa-icon.svg'), 180, join(publicDir, 'apple-touch-icon.png'));