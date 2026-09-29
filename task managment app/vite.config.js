import react from '@vitejs/plugin-react'
import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Yahan plugin SPA fallback file banata hai, kyunki plain static hosting par /app ya /app/insights jaise deep links par server 404 deta hai.
// 404.html ko index.html ka exact copy rakha jaata hai, jisse app usi URL par load hoti hai aur React Router ko asli pathname mil jaata hai.
function spaFallbackPlugin() {
  return {
    name: 'daymark-spa-fallback',
    apply: 'build',
    closeBundle() {
      const distPath = resolve(process.cwd(), 'dist')
      // Netlify/Cloudflare Pages par _redirects SPA fallback apply karta hai.
      writeFileSync(resolve(distPath, '_redirects'), '/*    /index.html   200\n')
      // GitHub Pages, S3/CloudFront aur Netlify 404.html serve karte hain, isliye index.html ka copy bhi rakha jaata hai.
      copyFileSync(resolve(distPath, 'index.html'), resolve(distPath, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    spaFallbackPlugin(),
    // Yahan VitePWA plugin isliye use kiya hai kyunki ye build ke baad hashed asset names ka manifest aur Workbox se service worker khud generate karta hai.
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      // Icons globPatterns se already precache ho jaate hain, isliye includeManifestIcons off rakha hai taaki duplicate cache entries na banein.
      includeManifestIcons: false,
      manifest: {
        id: '/',
        name: 'Daymark — Task space',
        short_name: 'Daymark',
        description: 'A calm, clear home for your tasks.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#1b5445',
        background_color: '#f2f2eb',
        lang: 'en',
        dir: 'ltr',
        categories: ['productivity', 'utilities'],
        icons: [
          { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/pwa/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'My tasks', short_name: 'Tasks', url: '/app' },
          { name: 'Insights', short_name: 'Insights', url: '/app/insights' },
        ],
      },
      workbox: {
        // SPA shell har build ke saath precache hoti hai, isliye offline pe app HTML + JS + CSS load ho jaata hai.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // 404.html sirf server-side fallback ke liye hai, isliye use precache me nahi daala jaata.
        globIgnores: ['**/404.html'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /\/[^/?]+\.[^/]+$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          {
            // Task data dynamic hai, isliye /api ke requests (same-origin ya cross-origin backend) seedhe network se jaate hain — koi stale response cache nahi hota.
            urlPattern: ({ url }) => url.pathname.includes('/api/'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      // Yahan dev SW on hai taaki install prompt aur DevTools → Application testing locally bhi kaam kare, lekin dev me navigation fallback nahi rakha taaki Vite HASSR chalu rahe.
      devOptions: {
        enabled: true,
        type: 'module',
        suppressWarnings: true,
      },
    }),
  ],
})
