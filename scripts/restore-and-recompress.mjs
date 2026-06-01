import sharp from 'sharp';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';

const COMMIT = '52792e4';
const DIR = 'public/assets/backgrounds-desktop';
const QUALITY = 88;

const MAP = [
  ['1.jpg', '1.jpg'],
  ['2.jpg', '2.jpg'],
  ['3.jpg', '3.jpg'],
  ['4.jpg', '4.jpg'],
  ['5.jpg', '5.jpg'],
  ['6.jpg', '7.jpg'],
  ['7.jpg', '8.jpg'],
  ['8.jpg', '9.jpg'],
  ['9.jpg', '10.jpg'],
  ['10.jpg', '11.jpg'],
  ['11.jpg', '12.jpg'],
];

for (const [oldName, newName] of MAP) {
  const buf = execSync(`git show ${COMMIT}:${DIR}/${oldName}`, { maxBuffer: 50 * 1024 * 1024 });
  const outPath = `${DIR}/${newName}`;
  const tmpPath = `${DIR}/_tmp_${newName}`;
  await sharp(buf)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmpPath);
  await fs.rename(tmpPath, outPath);
  const { size } = await fs.stat(outPath);
  console.log(`${oldName} → ${newName}: ${Math.round(size / 1024)}KB`);
}
