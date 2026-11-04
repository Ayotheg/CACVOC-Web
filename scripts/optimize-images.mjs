/* Makes the lighter images the site actually loads, so public/ can keep full-size originals.
   Runs before `npm run dev` and `npm run build`, and only redoes images that have changed. */
import { mkdir, readdir, stat, utimes } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp'])

/* Each output is stamped with its source's date, and any difference means the source changed.
   A plain "is it newer" check would miss a replacement photo that keeps an older date. */
const sameDate = (a, b) => Math.abs(a.mtimeMs - b.mtimeMs) < 1000

const convert = async (input, output, maxSize) => {
  const source = await stat(input)
  const existing = await stat(output).catch(() => null)
  if (existing && sameDate(source, existing)) return

  await sharp(input)
    .rotate()
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(output)
  await utimes(output, source.atime, source.mtime)
  console.log(`optimized ${path.basename(input)} -> ${output}`)
}

const galleryFiles = await readdir('public/gallery')
await mkdir('public/gallery/web', { recursive: true })

for (const file of galleryFiles) {
  const { name, ext } = path.parse(file)
  if (SOURCE_TYPES.has(ext.toLowerCase())) {
    await convert(`public/gallery/${file}`, `public/gallery/web/${name}.webp`, 1280)
  }
}

await convert('public/Bishop Isaac.jpg', 'public/bishop-isaac.webp', 640)
