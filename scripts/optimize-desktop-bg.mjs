import sharp from 'sharp';
import { readdir, rename, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIR = new URL('../public/assets/backgrounds-desktop/', import.meta.url).pathname.slice(1);
const MAX_WIDTH = 1920;
const QUALITY = 75;

const files = (await readdir(DIR)).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

for (const file of files) {
  const src = join(DIR, file);
  const ext = extname(file).toLowerCase();
  const base = basename(file, ext);
  const tmp = join(DIR, `${base}_tmp.jpg`);

  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);

  await unlink(src);

  const dest = join(DIR, `${base}.jpg`);
  await rename(tmp, dest);

  const { size: before } = await import('fs').then(m => m.promises.stat(src).catch(() => ({ size: 0 })));
  const { size: after } = await import('fs').then(m => m.promises.stat(dest));
  console.log(`${file} → ${base}.jpg  (${Math.round(after / 1024)}KB)`);
}
