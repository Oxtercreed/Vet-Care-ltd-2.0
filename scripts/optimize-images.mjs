import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/images/vet");
const files = fs.readdirSync(dir);

console.log("Optimizing images in", dir);

let originalTotal = 0;
let optimizedTotal = 0;

for (const file of files) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;

  const fullPath = path.join(dir, file);
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const webpPath = path.join(dir, `${baseName}.webp`);

  const stat = fs.statSync(fullPath);
  originalTotal += stat.size;

  const image = sharp(fullPath);
  const metadata = await image.metadata();

  // Create WebP version
  await sharp(fullPath)
    .webp({ quality: 84, effort: 4 })
    .toFile(webpPath);

  const webpStat = fs.statSync(webpPath);
  optimizedTotal += webpStat.size;

  console.log(
    `✓ ${file} (${Math.round(stat.size / 1024)} KB) -> ${baseName}.webp (${Math.round(webpStat.size / 1024)} KB) [${Math.round((1 - webpStat.size / stat.size) * 100)}% smaller]`
  );

  // If JPEG, also compress in-place with progressive mozjpeg so fallback is lean
  if (/\.jpe?g$/i.test(file)) {
    const tempJpg = path.join(dir, `${baseName}.tmp.jpg`);
    await sharp(fullPath)
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toFile(tempJpg);
    fs.renameSync(tempJpg, fullPath);
  }
}

console.log("\n=================================");
console.log(`Original total:  ${(originalTotal / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Optimized WebP:  ${(optimizedTotal / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Total saved:     ${Math.round((1 - optimizedTotal / originalTotal) * 100)}% reduction!`);
