import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const INPUT_DIR = 'public/assets/pyxl-images';
const OUTPUT_DIR = 'public/assets/pyxl-images';

const jobs = [
  // Animated GIFs → animated WebP, resized to 900px wide, lower quality
  { in: '1.gif', out: '1.webp', animated: true, width: 900, quality: 65 },
  { in: '2.gif', out: '2.webp', animated: true, width: 900, quality: 65 },
  { in: '3.gif', out: '3.webp', animated: true, width: 900, quality: 65 },
  // PNGs → WebP (4.png downsized from 12500px)
  { in: '4.png', out: '4.webp', width: 2400 },
  { in: '5.png', out: '5.webp' },
  { in: '6.png', out: '6.webp' },
  { in: '7.png', out: '7.webp' },
];

async function fileSize(path) {
  const s = await stat(path);
  return (s.size / 1024 / 1024).toFixed(2) + ' MB';
}

for (const job of jobs) {
  const inPath  = join(INPUT_DIR, job.in);
  const outPath = join(OUTPUT_DIR, job.out);

  const before = await fileSize(inPath);

  let pipeline = sharp(inPath, { animated: job.animated ?? false, limitInputPixels: false });
  if (job.width) pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });
  pipeline = pipeline.webp({ quality: job.quality ?? 82, effort: 6 });

  await pipeline.toFile(outPath);

  const after = await fileSize(outPath);
  console.log(`${job.in} (${before}) → ${job.out} (${after})`);
}

console.log('\nDone.');
