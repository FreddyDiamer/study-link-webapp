<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { tutorService } from '@/services'
import type { Tutor, TutorSearchParams } from '@/api/tutors'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

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

// Доступные предметы
const availableSubjects = ref<string[]>([])

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
      sortBy: getSortField(selectedSort.value),
      sortOrder: getSortOrder(selectedSort.value),
      page: currentPage.value,
      limit: 10,
    }

    const response = await tutorService.searchTutors(params)

    tutors.value = response.tutors
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
 * Загрузка доступных предметов
 */
const loadSubjects = async () => {
  try {
    availableSubjects.value = await tutorService.getSubjects()
  } catch (err) {
    console.error('Ошибка загрузки предметов:', err)
  }
}

/**
 * Получение поля сортировки
 */
const getSortField = (sort: string): TutorSearchParams['sortBy'] => {
  switch (sort) {
    case 'rating':
      return 'rating'
    case 'price-low':
    case 'price-high':
      return 'price'
    case 'experience':
      return 'experience'
    case 'reviews':
      return 'reviews'
    default:
      return 'rating'
  }
}

/**
 * Получение порядка сортировки
 */
const getSortOrder = (sort: string): TutorSearchParams['sortOrder'] => {
  return sort === 'price-low' ? 'asc' : 'desc'
}

// Watchers для автоматической перезагрузки
let searchTimeout: number | null = null

watch([searchQuery, selectedSubject, selectedSort], () => {
  currentPage.value = 1

  // Debounce для поиска
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    loadTutors()
  }, 300)
})

onMounted(() => {
  // Получаем предмет из параметров маршрута
  const subject = route.query.subject as string
  if (subject) {
    selectedSubject.value = subject
  }

  // Получаем поисковый запрос из параметров
  const search = route.query.search as string
  if (search) {
    searchQuery.value = search
  }

  // Загружаем данные
  loadSubjects()
  loadTutors()
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
        <p class="text-telegram-textSecondary">{{ filteredTutors.length }} репетиторов найдено</p>
      </div>
    </div>

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
            class="w-4 h-4 text-telegram-textSecondary"
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
          class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="{
            'bg-telegram-accent text-white': selectedSubject === null,
            'bg-telegram-secondary text-telegram-textSecondary': selectedSubject !== null,
          }"
        >
          Все
        </button>
        <button
          v-for="subject in availableSubjects"
          :key="subject"
          @click="selectSubject(subject)"
          class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="{
            'bg-telegram-accent text-white': selectedSubject === subject,
            'bg-telegram-secondary text-telegram-textSecondary': selectedSubject !== subject,
          }"
        >
          {{ subject }}
        </button>
      </div>

      <!-- Sort -->
      <div class="flex items-center justify-between">
        <span class="text-telegram-textSecondary text-sm">Сортировка:</span>
        <select
          v-model="selectedSort"
          class="bg-telegram-secondary text-telegram-text border-none rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-telegram-accent"
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
          class="w-10 h-10 text-telegram-textSecondary"
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
      <p class="text-telegram-textSecondary mb-6">
        Попробуйте изменить критерии поиска или выберите другой предмет
      </p>
      <Button @click="selectSubject(null)" variant="secondary"> Показать всех репетиторов </Button>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="tutor in filteredTutors"
        :key="tutor.id"
        @click="viewTutorProfile(tutor)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div
                class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-lg"
              >
                {{ tutor.avatar }}
              </div>
              <div
                v-if="tutor.isOnline"
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-telegram-success rounded-full border-2 border-telegram-card"
              ></div>
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h3 class="text-telegram-text font-semibold text-lg">{{ tutor.name }}</h3>
                <div v-if="tutor.isVerified" class="w-4 h-4 text-telegram-accent">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  v-if="tutor.isTopRated"
                  class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded"
                >
                  TOP
                </div>
              </div>
              <p class="text-telegram-textSecondary text-sm mb-2">{{ tutor.education }}</p>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="text-telegram-text font-semibold">{{ tutor.rating }}</span>
                  <span class="text-telegram-textSecondary text-sm"
                    >({{ tutor.reviewsCount }})</span
                  >
                </div>
                <span class="text-telegram-textSecondary text-sm"
                  >{{ tutor.experience }} лет опыта</span
                >
                <span class="text-telegram-success font-semibold">{{ tutor.price }}₽/занятие</span>
              </div>
            </div>
          </div>
          <button
            @click.stop="addToFavorites(tutor)"
            class="p-2 rounded-lg hover:bg-telegram-secondary transition-colors"
          >
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <!-- Subjects and Specializations -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="subject in tutor.subjects"
              :key="subject"
              class="px-2 py-1 bg-telegram-accent/10 text-telegram-accent text-xs rounded-lg font-medium"
            >
              {{ subject }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="spec in tutor.specializations"
              :key="spec"
              class="px-2 py-1 bg-telegram-secondary text-telegram-textSecondary text-xs rounded-lg"
            >
              {{ spec }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-text text-sm mb-4">{{ tutor.description }}</p>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Формат занятий</p>
            <p class="text-telegram-text text-sm">{{ tutor.format.join(', ') }}</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Доступность</p>
            <p class="text-telegram-text text-sm">{{ tutor.availability }}</p>
          </div>
        </div>

        <!-- Response time -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <div
              :class="[
                tutor.isOnline ? 'bg-telegram-success' : 'bg-telegram-textSecondary',
                'w-2 h-2 rounded-full',
              ]"
            ></div>
            <span class="text-telegram-textSecondary text-sm">
              {{ tutor.isOnline ? 'Онлайн' : 'Не в сети' }} • Отвечает в течение
              {{ tutor.responseTime }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <Button @click.stop="contactTutor(tutor)" class="flex-1"> Написать </Button>
          <Button @click.stop="createOrderForTutor(tutor)" variant="secondary" class="flex-1">
            Заказать урок
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>
