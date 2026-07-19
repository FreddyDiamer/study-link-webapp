<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Stores
import { useAppStore, useAuthStore, useTelegramStore } from '@/stores'

// Composables
import { useEducation } from '@/shared/composables'

// Components
import { Button, Card, Input } from '@components/ui'
import QuickActions from '../components/QuickActions.vue'
import SelectGroupCard from '../components/SelectGroupCard.vue'
import { PATHS } from '@/router/paths'

// Composables
const router = useRouter()
const telegramStore = useTelegramStore()
const appStore = useAppStore()
const authStore = useAuthStore()

const {
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

// Data
const searchQuery = ref('')

const search = () => {
  telegramStore.hapticFeedback('light')
  const searchValue = searchQuery.value.trim()
  router.push({
    path: PATHS.STUDENT_SERVICES,
    query: searchValue ? { search: searchValue } : {},
  })
}

// Инициализация образовательных данных
onMounted(async () => {
  if (!isInitialized.value) {
    await initialize()
  }
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 flex flex-col gap-6">
    <!-- Group Number Input -->
    <SelectGroupCard v-if="appStore.showGroupCard || !authStore.user?.group" />

    <!-- Загрузка образовательных данных -->
    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <!-- Ошибка образовательных данных -->
    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button
        @click="initialize"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>

    <!-- Основной контент -->
    <div class="space-y-5" v-else>
      <!-- Search -->
      <Card class="p-4">
        <div class="space-y-3">
          <Input
            v-model="searchQuery"
            placeholder="Поиск репетиторов, предметов..."
            class="w-full"
          />
          <Button @click="search" class="w-full" size="sm">Найти услугу</Button>
        </div>
      </Card>

      <!-- Quick actions -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-telegram-text mb-4">Быстрые действия</h2>
        <QuickActions />
      </div>
    </div>
  </div>
</template>
