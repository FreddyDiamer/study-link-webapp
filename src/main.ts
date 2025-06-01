import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telegramService } from '@/services/integrations/telegram'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Инициализация Telegram WebApp
telegramService.init()

// Инициализация авторизации
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
