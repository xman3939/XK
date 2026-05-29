import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

async function fileSize(path) {
  const s = await stat(path);
  return (s.size / 1024 / 1024).toFixed(2) + ' MB';
}

const jobs = [
  // PYXL new image
  { in: 'public/assets/pyxl-images/9.png',      out: 'public/assets/pyxl-images/9.webp' },
  // TERRA new images (massive originals)
  { in: 'public/assets/terra-images/13.jpg',     out: 'public/assets/terra-images/13.webp', width: 2400 },
  { in: 'public/assets/terra-images/14.jpg',     out: 'public/assets/terra-images/14.webp', width: 2400 },
  { in: 'public/assets/terra-images/15.jpg',     out: 'public/assets/terra-images/15.webp', width: 2400 },
  { in: 'public/assets/terra-images/16.jpg',     out: 'public/assets/terra-images/16.webp', width: 2400 },
  { in: 'public/assets/terra-images/17.jpg',     out: 'public/assets/terra-images/17.webp', width: 2400 },
  { in: 'public/assets/terra-images/18.jpg',     out: 'public/assets/terra-images/18.webp', width: 2400 },
  { in: 'public/assets/terra-images/19.jpg',     out: 'public/assets/terra-images/19.webp', width: 2400 },
  // PROJECT 152 new images
  { in: 'public/assets/p152-images/1.jpg',       out: 'public/assets/p152-images/1.webp', width: 2400 },
  { in: 'public/assets/p152-images/2.jpg',       out: 'public/assets/p152-images/2.webp', width: 2400 },
  { in: 'public/assets/p152-images/3.jpg',       out: 'public/assets/p152-images/3.webp', width: 2400 },
  { in: 'public/assets/p152-images/4.jpg',       out: 'public/assets/p152-images/4.webp', width: 2400 },
];

for (const job of jobs) {
  const before = await fileSize(job.in);
  let pipeline = sharp(job.in, { limitInputPixels: false });
  if (job.width) pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });
  pipeline = pipeline.webp({ quality: 85, effort: 5 });
  await pipeline.toFile(job.out);
  const after = await fileSize(job.out);
  console.log(`${job.in.split('/').pop()} (${before}) → ${job.out.split('/').pop()} (${after})`);
}

console.log('\nDone.');
