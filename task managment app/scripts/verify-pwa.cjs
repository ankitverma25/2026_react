const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const dist = join(__dirname, '..', 'dist')
const sw = readFileSync(join(dist, 'sw.js'), 'utf8')
const urls = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1])
console.log(urls.length, 'precache entries')
for (const url of urls) console.log(' -', url)
const required = ['pwa/icon-192.png', 'pwa/icon-512.png', 'pwa/icon-maskable-192.png', 'pwa/icon-maskable-512.png', 'pwa/apple-touch-icon.png', 'index.html']
console.log('missing required:', required.filter((file) => !urls.includes(file)))
