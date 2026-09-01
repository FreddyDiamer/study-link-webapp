<script setup lang="ts">
// Vue
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Store
import { useTelegramStore } from '@/stores/telegram'
import { useAppStore, type UserFlow } from '@/stores/app'

// Component
import Button from '@/shared/components/ui/Button.vue'
import { StudentIcon, TutorIcon, ArrowIcon } from '@components/icons'

// Constants
import { PATHS } from '@/router/paths'

// Composables
const router = useRouter()

// Stores
const telegramStore = useTelegramStore()
const appStore = useAppStore()

// Data
const showFlowSelector = ref(false)

// Computed
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

// Methods
const openHomePage = () => {
  telegramStore.hapticFeedback('light')

  if (appStore.isStudentFlow) {
    router.push(PATHS.STUDENT_MAIN)
  } else {
    router.push(PATHS.TUTOR_MAIN)
  }
}

const openProfilePage = () => {
  telegramStore.hapticFeedback('light')
  router.push(PATHS.STUDENT_PROFILE)
}

const toggleFlowSelector = () => {
  telegramStore.hapticFeedback('light')
  showFlowSelector.value = !showFlowSelector.value
}

const selectFlow = (flow: UserFlow) => {
  telegramStore.hapticFeedback('medium')

  appStore.setFlow(flow)
  showFlowSelector.value = false

  openHomePage()
}

const handleLogoClick = () => {
  if (appStore.isStudentFlow) {
    router.push(PATHS.STUDENT_MAIN)
  } else {
    router.push(PATHS.TUTOR_MAIN)
  }
}
</script>

<template>
  <header
    class="bg-telegram-card border-b border-telegram-border fixed top-0 left-0 right-0 z-50 backdrop-blur-xs"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <!-- Logo/Title -->
      <div class="flex items-center space-x-3" @click="handleLogoClick">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="{
            'bg-telegram-success': appStore.isTutorFlow,
            'bg-telegram-accent': appStore.isStudentFlow,
          }"
        >
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
          <Button
            variant="ghost"
            @click="toggleFlowSelector"
            size="sm"
            class="flex items-center gap-2 px-1.5"
            :class="{
              'text-telegram-success': appStore.isTutorFlow,
              'text-telegram-accent': appStore.isStudentFlow,
            }"
          >
            <div v-if="appStore.isStudentFlow" class="icon-wrapper bg-telegram-accent">
              <StudentIcon class="size-5" />
            </div>
            <div v-else class="icon-wrapper bg-telegram-success">
              <TutorIcon class="size-5" />
            </div>

            {{ flowDisplayName }}

            <ArrowIcon
              class="size-4 transition-transform duration-200"
              :class="{ 'rotate-180': showFlowSelector }"
            />
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
              <div class="icon-wrapper bg-telegram-accent">
                <StudentIcon class="size-5" />
              </div>
              <div>
                <div class="text-telegram-text font-medium text-sm">Студент</div>
                <div class="text-telegram-text-secondary text-xs">Ищу репетитора</div>
              </div>
            </button>

            <button
              @click="selectFlow('tutor')"
              class="w-full px-4 py-3 text-left hover:bg-telegram-secondary transition-colors duration-150 flex items-center space-x-3"
              :class="{ 'bg-telegram-secondary': appStore.isTutorFlow }"
            >
              <div class="icon-wrapper bg-telegram-success">
                <TutorIcon class="size-5" />
              </div>
              <div>
                <div class="text-telegram-text font-medium text-sm">Репетитор</div>
                <div class="text-telegram-text-secondary text-xs">Предлагаю услуги</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Profile Avatar -->
        <div
          class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
          :class="{
            'bg-telegram-success': appStore.isTutorFlow,
            'bg-telegram-accent': appStore.isStudentFlow,
          }"
          @click="openProfilePage"
        >
          {{ userInitials }}
        </div>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showFlowSelector" @click="showFlowSelector = false" class="fixed inset-0 z-0"></div>
  </header>
</template>

<style scoped>
/* В Tailwind v4 блок <style> не видит тему сам по себе — @apply требует @reference */
@reference '../../../assets/main.css';

.icon-wrapper {
  @apply w-8 h-8 rounded-lg text-white;
  @apply flex items-center justify-center;
}
</style>
