<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useAppStore, type UserFlow } from '@/stores/app'
import { onMounted, ref } from 'vue'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'

const router = useRouter()
const telegramStore = useTelegramStore()
const appStore = useAppStore()
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

const selectRole = (flow: UserFlow) => {
  telegramStore.hapticFeedback('light')
  appStore.setFlow(flow)

  if (flow === 'student') {
    router.push('/student')
  } else {
    router.push('/tutor')
  }
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <!-- Header с градиентом -->
    <div
      class="bg-linear-to-br from-telegram-accent to-telegram-button px-4 pt-8 pb-12 text-center"
    >
      <div
        class="w-24 h-24 bg-white/20 backdrop-blur-xs rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all duration-700"
        :class="{ 'animate-bounce-subtle': isLoaded }"
      >
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      </div>

      <h1
        class="text-3xl font-bold text-white mb-3 transition-all duration-500"
        :class="{ 'animate-fade-in': isLoaded }"
      >
        Добро пожаловать!
      </h1>

      <p
        class="text-white/90 text-lg leading-relaxed max-w-xs mx-auto transition-all duration-700 delay-200"
        :class="{ 'animate-slide-up': isLoaded }"
      >
        Выберите вашу роль чтобы начать пользоваться приложением
      </p>
    </div>

    <!-- Основной контент -->
    <div class="px-4 -mt-6 pb-8">
      <!-- Выбор роли -->
      <div
        class="space-y-4 mb-8 transition-all duration-700 delay-300"
        :class="{ 'animate-slide-up': isLoaded }"
      >
        <Card
          class="p-6 bg-telegram-card border border-telegram-border hover:border-telegram-accent transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-telegram hover:shadow-card-hover"
          @click="selectRole('student')"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-14 h-14 bg-linear-to-br from-telegram-button to-telegram-button-hover rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-semibold text-telegram-text mb-1">Я студент</h3>
              <p class="text-telegram-text-secondary text-sm leading-relaxed">
                Ищу репетитора для подготовки к экзаменам и изучения предметов
              </p>
            </div>

            <div
              class="w-8 h-8 bg-telegram-accent/10 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-telegram-accent"
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
          </div>
        </Card>

        <Card
          class="p-6 bg-telegram-card border border-telegram-border hover:border-telegram-success transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-telegram hover:shadow-card-hover"
          @click="selectRole('tutor')"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-14 h-14 bg-linear-to-br from-telegram-success to-green-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-semibold text-telegram-text mb-1">Я репетитор</h3>
              <p class="text-telegram-text-secondary text-sm leading-relaxed">
                Предлагаю помощь в изучении предметов и подготовке к экзаменам
              </p>
            </div>

            <div
              class="w-8 h-8 bg-telegram-success/10 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-telegram-success"
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
          </div>
        </Card>
      </div>

      <!-- Преимущества -->
      <Card
        class="p-6 bg-telegram-card border border-telegram-border shadow-telegram transition-all duration-700 delay-500"
        :class="{ 'animate-slide-up': isLoaded }"
      >
        <h3 class="text-lg font-semibold text-telegram-text mb-4 text-center">
          Почему выбирают нас?
        </h3>

        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center shrink-0 mt-0.5"
            >
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium text-sm">Знание требований преподавателей</p>
              <p class="text-telegram-text-secondary text-xs mt-1">
                Репетиторы знают специфику конкретных преподавателей
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center shrink-0 mt-0.5"
            >
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium text-sm">Быстрый поиск</p>
              <p class="text-telegram-text-secondary text-xs mt-1">
                Найди репетитора по предмету и преподавателю за минуты
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center shrink-0 mt-0.5"
            >
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium text-sm">Безопасные платежи</p>
              <p class="text-telegram-text-secondary text-xs mt-1">
                Все транзакции проходят через защищенную систему Telegram
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up 0.6s ease-out forwards;
}

@keyframes bounce-subtle {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
