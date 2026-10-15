import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const jobs = [
  { file: "0001.png", width: 420, quality: 78 },
  { file: "0003.png", width: 420, quality: 78 },
  { file: "tapme-logo.png", width: 128, quality: 80 },
  { file: "checkmark.png", width: 96, quality: 80 },
  { file: "verified.png", width: 80, quality: 80 },
];

for (const job of jobs) {
  const input = join(root, job.file);
  const output = join(root, job.file.replace(/\.png$/i, ".webp"));
  await sharp(input)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(output);

  const before = statSync(input).size;
  const after = statSync(output).size;
  console.log(
    `${job.file} -> ${job.file.replace(/\.png$/i, ".webp")}: ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB`,
  );
}
