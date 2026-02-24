import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { telegramService } from '@/services/integrations/telegram'
import { queryClient, setupQueryCacheWatcher } from '@/shared/lib/query-client'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Настраиваем Vue Query
app.use(VueQueryPlugin, {
  queryClient,
})

app.use(router)

// Инициализация Telegram WebApp
telegramService.init()

app.mount('#app')
