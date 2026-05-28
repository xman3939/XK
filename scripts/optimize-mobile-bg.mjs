import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/assets/backgrounds-mobile';

const files = [
  '1.jpg', '2.png', '3.jpg', '4.jpg', '5.jpg',
  '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg',
];

async function fileSize(path) {
  const s = await stat(path);
  return (s.size / 1024 / 1024).toFixed(2) + ' MB';
}

for (const file of files) {
  const inPath  = join(DIR, file);
  const outName = file.replace(/\.(jpg|png)$/i, '.webp');
  const outPath = join(DIR, outName);

  const before = await fileSize(inPath);

  await sharp(inPath, { limitInputPixels: false })
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(outPath);

  const after = await fileSize(outPath);
  console.log(`${file} (${before}) → ${outName} (${after})`);
}

console.log('\nDone.');
