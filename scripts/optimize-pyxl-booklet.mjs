import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/assets/pyxl-images';

async function fileSize(path) {
  const s = await stat(path);
  return (s.size / 1024 / 1024).toFixed(2) + ' MB';
}

const files = (await readdir(DIR)).filter((f) => f.startsWith('pyxl_booklet') && f.endsWith('.jpg'));

for (const file of files) {
  const inPath = join(DIR, file);
  const outPath = join(DIR, file.replace('.jpg', '.webp'));

  const before = await fileSize(inPath);
  await sharp(inPath, { limitInputPixels: false })
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(outPath);
  const after = await fileSize(outPath);

  console.log(`${file} (${before}) -> ${file.replace('.jpg', '.webp')} (${after})`);
}

console.log('\nDone.');
