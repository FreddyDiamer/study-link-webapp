import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telegramService } from '@/services/integrations/telegram'

// Экраны грузятся частями при переходе. Если приложение было открыто во время деплоя,
// старых частей на сервере уже нет — переход падает. Перезагружаемся на новую версию,
// но не чаще раза в минуту: если файла нет и в свежей сборке, крутить перезагрузки незачем
const RELOAD_KEY = 'sl:chunk-reload-at'
window.addEventListener('vite:preloadError', (event) => {
  let last = 0
  try {
    last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
  } catch {
    // нет доступа к хранилищу — перезагрузимся без защиты от повтора
  }
  if (Date.now() - last < 60_000) return
  event.preventDefault()
  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    // см. выше
  }
  window.location.reload()
})

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)

// Инициализация Telegram WebApp
telegramService.init()

app.mount('#app')
