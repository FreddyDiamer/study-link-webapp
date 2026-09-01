<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useTutor } from '@/shared/composables'
import type { Tutor, TutorSearchParams } from '@/shared/types'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()
const { searchTutors } = useTutor()
const {
  activeSubjects,
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

const searchQuery = ref('')
const selectedSubject = ref<string | null>(null)
const selectedSort = ref('rating')
const showFilters = ref(false)

// Состояние загрузки и данных
const isLoading = ref(false)
const error = ref<string | null>(null)
const tutors = ref<Tutor[]>([])
const totalTutors = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)

// Вычисляемые свойства для предметов
const availableSubjects = computed(() => activeSubjects.value.map((subject) => subject.name))

const filteredTutors = computed(() => tutors.value)

const pageTitle = computed(() => {
  if (selectedSubject.value) {
    return `Репетиторы по ${selectedSubject.value.toLowerCase()}`
  }
  return 'Все репетиторы'
})

/**
 * Загрузка репетиторов
 */
const loadTutors = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params: TutorSearchParams = {
      subject: selectedSubject.value || undefined,
      search: searchQuery.value.trim() || undefined,
      minRating: selectedSort.value === 'rating' ? 4 : undefined,
      page: currentPage.value,
      limit: 10,
    }

    const response = await searchTutors(params)

    tutors.value = response.items
    totalTutors.value = response.total
    totalPages.value = response.totalPages
  } catch (err: any) {
    error.value = err.message
    console.error('Ошибка загрузки репетиторов:', err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Переключение страниц
 */
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadTutors()
  }
}

/**
 * Обработка поиска
 */
const handleSearch = () => {
  currentPage.value = 1
  loadTutors()
}

/**
 * Обработка изменения фильтров
 */
const handleFilterChange = () => {
  currentPage.value = 1
  loadTutors()
}

/**
 * Сброс фильтров
 */
const resetFilters = () => {
  searchQuery.value = ''
  selectedSubject.value = null
  selectedSort.value = 'rating'
  currentPage.value = 1
  loadTutors()
}

/**
 * Переход к профилю репетитора
 */
const goToTutorProfile = (tutorId: string) => {
  router.push(`/tutors/${tutorId}`)
}

/**
 * Форматирование цены
 */
const formatPrice = (price: number) => {
  return `${price} ₽`
}

/**
 * Форматирование рейтинга
 */
const formatRating = (rating: number) => {
  return rating.toFixed(1)
}

// Watchers
watch([searchQuery, selectedSubject, selectedSort], () => {
  if (isInitialized.value) {
    handleFilterChange()
  }
})

// Инициализация
onMounted(async () => {
  if (!isInitialized.value) {
    await initialize()
  }
  await loadTutors()
})

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const selectSubject = (subject: string | null) => {
  telegramStore.hapticFeedback('light')
  selectedSubject.value = subject

  // Обновляем URL
  const query = subject ? { subject } : {}
  router.replace({ query })
}

const contactTutor = (tutor: any) => {
  telegramStore.hapticFeedback('medium')
  console.log('Связаться с репетитором:', tutor.name)
  // TODO: Открыть чат или профиль репетитора
}

const viewTutorProfile = (tutor: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Просмотр профиля:', tutor.name)
  // TODO: Навигация к детальному профилю репетитора
}

const addToFavorites = (tutor: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Добавить в избранное:', tutor.name)
  // TODO: Добавить в избранное
}

const createOrderForTutor = (tutor: any) => {
  telegramStore.hapticFeedback('medium')
  console.log('Создать заявку для репетитора:', tutor.name)
  router.push({
    path: '/student/orders/create',
    query: {
      subject: selectedSubject.value || '',
      tutorId: tutor.id,
    },
  })
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center mb-6">
      <Button variant="secondary" size="sm" @click="goBack" class="mr-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>
      <div>
        <h1 class="text-2xl font-bold text-telegram-text">{{ pageTitle }}</h1>
        <p class="text-telegram-text-secondary">{{ filteredTutors.length }} репетиторов найдено</p>
      </div>
    </div>

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
    <div v-else>
      <!-- Search and Filters -->
      <div class="space-y-4 mb-6">
        <!-- Search -->
        <Input
          v-model="searchQuery"
          placeholder="Поиск по имени, предмету, специализации..."
          class="w-full"
        >
          <template #prepend>
            <svg
              class="w-4 h-4 text-telegram-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </Input>

        <!-- Subject filters -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            @click="selectSubject(null)"
            class="shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-telegram-accent text-white': selectedSubject === null,
              'bg-telegram-secondary text-telegram-text-secondary': selectedSubject !== null,
            }"
          >
            Все
          </button>
          <button
            v-for="subject in availableSubjects"
            :key="subject"
            @click="selectSubject(subject)"
            class="shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-telegram-accent text-white': selectedSubject === subject,
              'bg-telegram-secondary text-telegram-text-secondary': selectedSubject !== subject,
            }"
          >
            {{ subject }}
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center justify-between">
          <span class="text-telegram-text-secondary text-sm">Сортировка:</span>
          <select
            v-model="selectedSort"
            class="bg-telegram-secondary text-telegram-text border-none rounded-lg px-3 py-1 text-sm focus:outline-hidden focus:ring-2 focus:ring-telegram-accent"
          >
            <option value="rating">По рейтингу</option>
            <option value="price-low">Сначала дешевле</option>
            <option value="price-high">Сначала дороже</option>
            <option value="experience">По опыту</option>
            <option value="reviews">По отзывам</option>
          </select>
        </div>
      </div>

      <!-- Tutors List -->
      <div v-if="filteredTutors.length === 0" class="text-center py-16">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-telegram-text mb-3">Репетиторы не найдены</h2>
        <p class="text-telegram-text-secondary mb-6">
          Попробуйте изменить критерии поиска или выберите другой предмет
        </p>
        <Button @click="selectSubject(null)" variant="secondary">
          Показать всех репетиторов
        </Button>
      </div>

      <div v-else class="space-y-4">
        <Card
          v-for="tutor in filteredTutors"
          :key="tutor.id"
          @click="goToTutorProfile(tutor.id)"
          class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-lg"
                >
                  {{ tutor.name?.charAt(0) || 'Р' }}
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-telegram-text font-semibold text-lg">{{ tutor.name }}</h3>
                </div>
                <p class="text-telegram-text-secondary text-sm mb-2">
                  {{ tutor.description || 'Репетитор' }}
                </p>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-telegram-text font-semibold">{{
                      formatRating(tutor.rating)
                    }}</span>
                    <span class="text-telegram-text-secondary text-sm"
                      >({{ tutor.reviewsCount }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Subjects -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="subject in tutor.subjects"
                :key="subject.id"
                class="px-2 py-1 bg-telegram-accent/10 text-telegram-accent text-xs rounded-lg font-medium"
              >
                {{ subject.name }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <Button @click.stop="goToTutorProfile(tutor.id)" class="flex-1"> Профиль </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
