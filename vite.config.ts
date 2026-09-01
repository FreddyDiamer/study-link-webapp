import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
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
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) принимает только функциональную форму manualChunks
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (/node_modules[\\/](@vue[\\/]|vue[\\/]|vue-router[\\/]|pinia[\\/])/.test(id)) return 'vendor'
          if (/node_modules[\\/](@vueuse[\\/]|axios[\\/])/.test(id)) return 'utils'
        },
      },
    },
  },
})
