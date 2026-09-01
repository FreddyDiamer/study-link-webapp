<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useTutor } from '@/shared/composables'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { PATHS } from '@/router/paths'
import type { User } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()
const { getFavoriteTutors, removeFromFavorites } = useTutor()

const favorites = ref<User[]>([])
const isLoading = ref(false)

const loadFavorites = async () => {
  isLoading.value = true
  try {
    const response = await getFavoriteTutors()
    favorites.value = response?.items || []
  } catch (error) {
    console.error('Ошибка загрузки избранного:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRemoveFavorite = async (tutorId: string) => {
  try {
    await removeFromFavorites(tutorId)
    await loadFavorites() // Перезагружаем список
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error)
  }
}

const goToTutorsList = () => {
  router.push(PATHS.STUDENT_TUTORS)
}

onMounted(() => {
  loadFavorites()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Избранное</h1>
      <p class="text-telegram-text-secondary">Репетиторы, которых вы добавили в избранное</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>

    <!-- Favorites list -->
    <div v-else-if="favorites.length > 0" class="space-y-4">
      <Card v-for="tutor in favorites" :key="tutor.id" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
            >
              {{ tutor.name?.charAt(0) || 'Р' }}
            </div>
            <div>
              <h3 class="font-semibold text-telegram-text">{{ tutor.name || 'Репетитор' }}</h3>
              <p class="text-sm text-telegram-text-secondary">
                {{ tutor.description || 'Описание не указано' }}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="handleRemoveFavorite(tutor.id)"
            class="text-telegram-destructive hover:text-telegram-destructive"
          >
            Удалить
          </Button>
        </div>
      </Card>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div
        class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <svg
          class="w-10 h-10 text-telegram-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      <h2 class="text-xl font-semibold text-telegram-text mb-3">Пока пусто</h2>

      <p class="text-telegram-text-secondary mb-8 max-w-sm mx-auto">
        Найдите репетиторов и добавьте понравившихся в избранное для быстрого доступа
      </p>

      <Button @click="goToTutorsList" class="mx-auto"> Найти репетиторов </Button>
    </div>
  </div>
</template>
