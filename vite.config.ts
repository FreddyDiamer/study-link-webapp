import { resolve } from 'node:path'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * Content-Security-Policy для production-сборки. Разрешаем только свой origin,
 * скрипт Telegram и API из VITE_API_BASE_URL — при XSS токен из localStorage
 * некуда отправить. В dev не ставим: Vite HMR требует inline/ws.
 */
const cspPlugin = (apiBaseUrl: string): Plugin => {
  const apiOrigin = (() => {
    try {
      return new URL(apiBaseUrl).origin
    } catch {
      return ''
    }
  })()
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://telegram.org",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin}`.trim(),
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'study-link-csp',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
      ),
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue(), vueDevTools(), cspPlugin(env.VITE_API_BASE_URL ?? '')],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@shared': resolve(__dirname, 'src/shared'),
        '@components': resolve(__dirname, 'src/shared/components'),
      },
    },
    server: {
      host: true,
      port: 3050,
      // Явный список вместо `true`: `true` отключает защиту от DNS rebinding
      // и открывает dev-сервер с исходниками любому хосту. Туннель добавляйте сюда.
      allowedHosts: ['localhost', '.localhost', '.ngrok-free.app', '.trycloudflare.com'],
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
