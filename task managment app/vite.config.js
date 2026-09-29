import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
