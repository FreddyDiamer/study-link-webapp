import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // API_PROXY_TARGET — без префикса VITE_, поэтому в клиентский бандл не попадает
  const { API_PROXY_TARGET } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@shared': resolve(__dirname, 'src/shared'),
        '@components': resolve(__dirname, 'src/shared/components'),
      },
    },
    server: {
      // TODO: remove this
      allowedHosts: true,
      host: true,
      port: 3050,
      // в проде /api на том же домене отдаёт бэкенду Caddy; в `pnpm dev` то же делает прокси
      proxy: {
        '/api': {
          target: API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            telegram: ['@telegram-apps/sdk-vue'],
            utils: ['@vueuse/core', 'axios'],
          },
        },
      },
    },
  }
})
