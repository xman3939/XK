import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

const DIRS = [
  'public/assets/terra-images',
  'public/assets/p152-images',
  'public/assets/crystalgoblet-images',
];

const MAX_WIDTH = 2400;

async function fileSize(path) {
  const s = await stat(path);
  return (s.size / 1024 / 1024).toFixed(2) + ' MB';
}

let totalBefore = 0;
let totalAfter = 0;

for (const dir of DIRS) {
  console.log(`\n--- ${dir} ---`);
  const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));

  for (const file of files) {
    const inPath = join(dir, file);
    const outPath = join(dir, file.replace(/\.jpe?g$/i, '.webp'));

    const beforeBytes = (await stat(inPath)).size;
    const before = await fileSize(inPath);

    await sharp(inPath, { limitInputPixels: false })
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(outPath);

    const afterBytes = (await stat(outPath)).size;
    const after = await fileSize(outPath);

    totalBefore += beforeBytes;
    totalAfter += afterBytes;

    console.log(`${file} (${before}) -> ${file.replace(/\.jpe?g$/i, '.webp')} (${after})`);

    await unlink(inPath);
  }
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
