import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telegramService } from '@/services/integrations/telegram'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)

// Инициализация Telegram WebApp
telegramService.init()

app.mount('#app')
