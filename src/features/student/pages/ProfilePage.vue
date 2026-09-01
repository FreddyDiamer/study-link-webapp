<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { PATHS } from '@/router/paths'
import type { User } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

const user = ref<User | null>(null)
const isLoading = ref(false)

const loadProfile = async () => {
  isLoading.value = true
  try {
    user.value = await userService.getProfile()
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const editProfile = () => {
  router.push(PATHS.STUDENT_EDIT_PROFILE)
}

const openFeedback = () => {
  // TODO: Открыть чат с поддержкой или внешнюю ссылку
  console.log('Открытие поддержки')
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Профиль</h1>
      <p class="text-telegram-text-secondary">Управляйте своим профилем и настройками</p>
    </div>

    <!-- Profile info -->
    <Card class="p-6 mb-6">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
      </div>

      <div v-else-if="user" class="flex items-center space-x-4">
        <div
          class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ user.name?.charAt(0) || telegramStore.firstName?.charAt(0) || 'У' }}
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-telegram-text">
            {{ user.name || telegramStore.firstName || 'Пользователь' }}
          </h2>
          <p class="text-telegram-text-secondary">
            @{{ user.telegramUsername || telegramStore.username || 'username' }}
          </p>
          <div class="inline-flex items-center mt-2 px-2 py-1 bg-telegram-button/10 rounded-lg">
            <svg
              class="w-4 h-4 text-telegram-button mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span class="text-telegram-button text-sm font-medium">Студент</span>
          </div>
        </div>
      </div>

      <!-- TODO: Добавить редактирование профиля -->
      <!-- <Button variant="ghost" class="w-full" @click="editProfile"> Редактировать профиль </Button> -->
    </Card>

    <!-- Блок обратной связи -->
    <div class="relative mt-6 group cursor-pointer" @click="openFeedback">
      <!-- Градиентный фон с анимацией -->
      <div
        class="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-75 group-hover:opacity-100 transition-all duration-300 blur-xs group-hover:blur-none"
      ></div>

      <!-- Основная карточка -->
      <Card
        class="relative p-6 backdrop-blur-xs bg-white/10 border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Анимированная иконка -->
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
            >
              <div class="text-xl">💡</div>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg mb-1">Помоги сделать лучше!</h3>
              <p class="text-white/80 text-sm">Есть идея? Нашли баг? Мы исправим! 🚀</p>
            </div>
          </div>

          <!-- Стрелка с анимацией -->
          <div
            class="w-8 h-8 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <!-- Дополнительная мотивация -->
        <div class="mt-4 pt-4 border-t border-white/20">
          <div class="flex items-center justify-between text-white/70 text-xs">
            <span>🎯 Каждое предложение важно</span>
            <span>⚡ Отвечаем быстро</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
