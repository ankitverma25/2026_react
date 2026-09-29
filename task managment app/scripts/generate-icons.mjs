// Yahan script isliye hai kyunki PWA ko exact 192/512 px PNG icons chahiye, aur project mein koi image toolchain (sharp/canvas) installed nahi hai.
// Brand mark public/favicon.svg se match karta hai: green rounded square + cream check mark.
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'pwa')

const BRAND = { bg: [0x17, 0x6b, 0x55], mark: [0xf5, 0xe5, 0xad] }
const ART = 48
const CORNER_RADIUS = 13
const CHECK = [
  [12, 25],
  [20, 33],
  [37, 14],
]
const STROKE = 5
const SAMPLES = 4

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared))
  const cx = ax + t * dx
  const cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}

function strokeDistance(px, py) {
  let best = Infinity
  for (let index = 0; index < CHECK.length - 1; index += 1) {
    const [ax, ay] = CHECK[index]
    const [bx, by] = CHECK[index + 1]
    best = Math.min(best, distanceToSegment(px, py, ax, ay, bx, by))
  }
  return best
}

function insideRoundedSquare(px, py, radius) {
  const inner = ART - radius
  if (px < radius && py < radius) return Math.hypot(px - radius, py - radius) <= radius
  if (px > inner && py < radius) return Math.hypot(px - inner, py - radius) <= radius
  if (px < radius && py > inner) return Math.hypot(px - radius, py - inner) <= radius
  if (px > inner && py > inner) return Math.hypot(px - inner, py - inner) <= radius
  return true
}

function sample(x, y, { contentScale, radius, bleed }) {
  // Maskable icons ko platform circle/squircle se crop kiya jaata hai, isliye art ko center se shrink karke safe zone me rakhte hain.
  const artX = (x - ART / 2) / contentScale + ART / 2
  const artY = (y - ART / 2) / contentScale + ART / 2
  if (strokeDistance(artX, artY) <= STROKE / 2) return BRAND.mark
  if (bleed || insideRoundedSquare(x, y, radius)) return BRAND.bg
  return null
}

function renderRGBA(size, options) {
  const pixels = Buffer.alloc(size * size * 4)
  const step = 1 / SAMPLES
  const weight = 1 / (SAMPLES * SAMPLES)
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const x = ((px + (sx + 0.5) * step) / size) * ART
          const y = ((py + (sy + 0.5) * step) / size) * ART
          const color = sample(x, y, options)
          if (color) {
            r += color[0] * weight
            g += color[1] * weight
            b += color[2] * weight
            a += weight
          }
        }
      }
      const offset = (py * size + px) * 4
      if (a > 0) {
        pixels[offset] = Math.round(r / a)
        pixels[offset + 1] = Math.round(g / a)
        pixels[offset + 2] = Math.round(b / a)
        pixels[offset + 3] = Math.round(a * 255)
      }
    }
  }
  return pixels
}

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([length, typed, crc])
}

function encodePNG(size, rgba) {
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y += 1) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const rounded = { contentScale: 1, radius: CORNER_RADIUS, bleed: false }
const maskable = { contentScale: 0.74, radius: 0, bleed: true }
const apple = { contentScale: 0.86, radius: 0, bleed: true }

const targets = [
  ['icon-192.png', 192, rounded],
  ['icon-512.png', 512, rounded],
  ['icon-maskable-192.png', 192, maskable],
  ['icon-maskable-512.png', 512, maskable],
  ['apple-touch-icon.png', 180, apple],
  ['favicon-32.png', 32, rounded],
]

mkdirSync(outDir, { recursive: true })
for (const [name, size, options] of targets) {
  writeFileSync(join(outDir, name), encodePNG(size, renderRGBA(size, options)))
  console.log(`wrote public/pwa/${name} (${size}x${size})`)
}
