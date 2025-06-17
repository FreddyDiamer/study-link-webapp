<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useAppStore, type UserFlow } from '@/stores/app'
import Button from '@/shared/components/ui/Button.vue'
import { useRouter } from 'vue-router'
import { PATHS } from '@/router/paths'

const router = useRouter()

const telegramStore = useTelegramStore()
const appStore = useAppStore()

const showFlowSelector = ref(false)

const userInitials = computed(() => {
  const firstName = telegramStore.firstName || 'Пользователь'
  const lastName = telegramStore.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

const flowDisplayName = computed(() => {
  switch (appStore.currentFlow) {
    case 'student':
      return 'Студент'
    case 'tutor':
      return 'Репетитор'
    default:
      return 'Выбрать роль'
  }
})

const toggleFlowSelector = () => {
  telegramStore.hapticFeedback('light')
  showFlowSelector.value = !showFlowSelector.value
}

const selectFlow = (flow: UserFlow) => {
  telegramStore.hapticFeedback('medium')
  appStore.setFlow(flow)
  showFlowSelector.value = false
}

const handleProfileClick = () => {
  telegramStore.hapticFeedback('light')

  if (appStore.isStudentFlow) {
    router.push(PATHS.STUDENT_PROFILE)
  } else {
    router.push(PATHS.TUTOR_PROFILE)
  }
}

const handleLogoClick = () => {
  if (appStore.isStudentFlow) {
    router.push(PATHS.STUDENT)
  } else {
    router.push(PATHS.TUTOR)
  }
}
</script>

<template>
  <header
    class="bg-telegram-card border-b border-telegram-border fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <!-- Logo/Title -->
      <div class="flex items-center space-x-3" @click="handleLogoClick">
        <div class="w-8 h-8 bg-telegram-accent rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-telegram-text">KAI</h1>
      </div>

      <!-- Flow Selector & Profile -->
      <div class="flex items-center space-x-2">
        <!-- Flow Selector -->
        <div class="relative">
          <Button variant="ghost" @click="toggleFlowSelector" size="sm" class="flex items-center">
            <span class="mr-2">{{ flowDisplayName }}</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': showFlowSelector }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          <!-- Flow Dropdown -->
          <div
            v-if="showFlowSelector"
            class="absolute right-0 top-full mt-2 w-48 bg-telegram-card border border-telegram-border rounded-xl shadow-lg py-2 z-10"
          >
            <button
              @click="selectFlow('student')"
              class="w-full px-4 py-3 text-left hover:bg-telegram-secondary transition-colors duration-150 flex items-center space-x-3"
              :class="{ 'bg-telegram-secondary': appStore.isStudentFlow }"
            >
              <div class="w-8 h-8 bg-telegram-button rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-white"
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
              </div>
              <div>
                <div class="text-telegram-text font-medium text-sm">Студент</div>
                <div class="text-telegram-textSecondary text-xs">Ищу репетитора</div>
              </div>
            </button>

            <button
              @click="selectFlow('tutor')"
              class="w-full px-4 py-3 text-left hover:bg-telegram-secondary transition-colors duration-150 flex items-center space-x-3"
              :class="{ 'bg-telegram-secondary': appStore.isTutorFlow }"
            >
              <div class="w-8 h-8 bg-telegram-success rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-white"
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
              </div>
              <div>
                <div class="text-telegram-text font-medium text-sm">Репетитор</div>
                <div class="text-telegram-textSecondary text-xs">Предлагаю услуги</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Profile Avatar -->
        <div
          class="w-9 h-9 bg-telegram-accent rounded-full flex items-center justify-center text-white text-sm font-medium"
          @click="handleProfileClick"
        >
          {{ userInitials }}
        </div>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showFlowSelector" @click="showFlowSelector = false" class="fixed inset-0 z-0"></div>
  </header>
</template>
