<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business'
import { useTutor } from '@/shared/composables'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { PATHS } from '@/router/paths'
import type { User } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()
const { getTutorStats } = useTutor()

const user = ref<User | null>(null)
const isLoading = ref(false)

// Статистика репетитора
const stats = ref([
  { label: 'Активных услуг', value: '0', icon: '📚' },
  { label: 'Заявок за месяц', value: '0', icon: '📋' },
  { label: 'Студентов', value: '0', icon: '👥' },
  { label: 'Рейтинг', value: '5.0', icon: '⭐' },
])

const loadProfile = async () => {
  isLoading.value = true
  try {
    user.value = await userService.getProfile()

    // Загружаем статистику репетитора
    const tutorStats = await getTutorStats()
    stats.value = [
      { label: 'Активных услуг', value: tutorStats.activeServices.toString(), icon: '📚' },
      { label: 'Заявок за месяц', value: tutorStats.monthlyRequests.toString(), icon: '📋' },
      { label: 'Студентов', value: tutorStats.totalStudents.toString(), icon: '👥' },
      { label: 'Рейтинг', value: tutorStats.averageRating.toFixed(1), icon: '⭐' },
    ]
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const openFeedback = () => {
  // Здесь будет логика открытия формы обратной связи
  console.log('Открыть форму обратной связи')
}

const openSupport = () => {
  // TODO: Открыть чат с поддержкой или внешнюю ссылку
  console.log('Открытие поддержки')
}

const editProfile = () => {
  router.push(PATHS.TUTOR_EDIT_PROFILE)
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Profile info -->
    <Card class="p-6 mb-6">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
      </div>

      <div v-else-if="user" class="flex items-center space-x-4 mb-6">
        <div
          class="w-16 h-16 bg-telegram-success rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ user.name?.charAt(0) || telegramStore.firstName?.charAt(0) || 'Р' }}
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-telegram-text">
            {{ user.name || telegramStore.firstName || 'Репетитор' }}
          </h2>
          <p class="text-telegram-textSecondary">
            @{{ user.telegramUsername || telegramStore.username || 'username' }}
          </p>
          <div class="inline-flex items-center mt-2 px-2 py-1 bg-telegram-success/10 rounded-lg">
            <svg
              class="w-4 h-4 text-telegram-success mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span class="text-telegram-success text-sm font-medium">Репетитор</span>
          </div>
        </div>
      </div>

      <Button variant="ghost" class="w-full" @click="editProfile"> Редактировать профиль </Button>
    </Card>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-4 mb-6 mt-6">
      <Card v-for="stat in stats" :key="stat.label" class="p-4 text-center">
        <div class="text-2xl mb-2">{{ stat.icon }}</div>
        <div class="text-2xl font-bold text-telegram-text mb-1">{{ stat.value }}</div>
        <div class="text-telegram-textSecondary text-sm">{{ stat.label }}</div>
      </Card>
    </div>

    <!-- Menu items -->
    <div class="space-y-3">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-telegram-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium">Отзывы</p>
              <p class="text-telegram-textSecondary text-sm">Рейтинг и комментарии</p>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-telegram-textSecondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-telegram-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium">Уведомления</p>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-telegram-textSecondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </div>

    <!-- Блок обратной связи -->
    <div class="relative mt-6 group cursor-pointer" @click="openFeedback">
      <!-- Градиентный фон с анимацией -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl opacity-75 group-hover:opacity-100 transition-all duration-300 blur-sm group-hover:blur-none"
      ></div>

      <!-- Основная карточка -->
      <Card
        class="relative p-6 backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Анимированная иконка -->
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
            >
              <div class="text-xl">🌟</div>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg mb-1">Сделаем платформу лучше!</h3>
              <p class="text-white/80 text-sm">Поделись опытом • Предложи улучшения 💪</p>
            </div>
          </div>

          <!-- Стрелка с анимацией -->
          <div
            class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300"
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
            <span>🎓 Твой опыт ценен</span>
            <span>🚀 Влияй на развитие</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
