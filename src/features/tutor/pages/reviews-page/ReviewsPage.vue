<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import ReviewCard from '@/shared/components/ReviewCard.vue'
import { reviewService } from '@/services/business'
import type { Review } from '@/shared/types'
import { UserRole } from '@/shared/types'

type AboutMeRole = 'TUTOR' | 'STUDENT'

const tab = ref<'about-me' | 'my'>('about-me')
const aboutMeRole = ref<AboutMeRole>('TUTOR')
const aboutMeReviewsTutor = ref<Review[]>([])
const aboutMeReviewsStudent = ref<Review[]>([])
const myReviews = ref<Review[]>([])
const loadingAboutMe = ref(false)
const loadingMy = ref(false)

const loading = computed(
  () => (tab.value === 'about-me' ? loadingAboutMe.value : loadingMy.value),
)
const aboutMeReviews = computed(() =>
  aboutMeRole.value === 'TUTOR' ? aboutMeReviewsTutor.value : aboutMeReviewsStudent.value,
)
const reviews = computed(() =>
  tab.value === 'about-me' ? aboutMeReviews.value : myReviewsFiltered.value,
)
const myReviewsFiltered = computed(() => {
  const list = myReviews.value
  if (aboutMeRole.value === 'TUTOR') {
    return list.filter((r) => r.targetRole === UserRole.TUTOR)
  }
  return list.filter((r) => r.targetRole === UserRole.STUDENT)
})

async function loadAboutMe(role: AboutMeRole) {
  loadingAboutMe.value = true
  try {
    const items = await reviewService.getAboutMe(role)
    if (role === 'TUTOR') aboutMeReviewsTutor.value = items
    else aboutMeReviewsStudent.value = items
  } finally {
    loadingAboutMe.value = false
  }
}

async function loadMy() {
  loadingMy.value = true
  try {
    myReviews.value = await reviewService.getMy()
  } finally {
    loadingMy.value = false
  }
}

function switchTab(t: 'about-me' | 'my') {
  tab.value = t
  if (t === 'about-me') {
    if (aboutMeReviews.value.length === 0) loadAboutMe(aboutMeRole.value)
  } else if (myReviews.value.length === 0) loadMy()
}

function switchAboutMeRole(role: AboutMeRole) {
  aboutMeRole.value = role
  if (role === 'TUTOR' && aboutMeReviewsTutor.value.length === 0) loadAboutMe('TUTOR')
  if (role === 'STUDENT' && aboutMeReviewsStudent.value.length === 0) loadAboutMe('STUDENT')
}

onMounted(() => {
  loadAboutMe(aboutMeRole.value)
})
watch(aboutMeRole, (role) => {
  if (tab.value === 'about-me' && ((role === 'TUTOR' && aboutMeReviewsTutor.value.length === 0) || (role === 'STUDENT' && aboutMeReviewsStudent.value.length === 0))) {
    loadAboutMe(role)
  }
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <h1 class="text-lg font-semibold text-telegram-text mb-4">Отзывы</h1>

    <div class="flex rounded-xl bg-telegram-secondary p-1 mb-4">
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          tab === 'about-me'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchTab('about-me')"
      >
        Отзывы обо мне
      </button>
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          tab === 'my'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchTab('my')"
      >
        Мои отзывы
      </button>
    </div>

    <div v-if="tab === 'about-me'" class="flex rounded-xl bg-telegram-secondary/70 p-1 mb-4">
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          aboutMeRole === 'TUTOR'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchAboutMeRole('TUTOR')"
      >
        Как репетитор
      </button>
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          aboutMeRole === 'STUDENT'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchAboutMeRole('STUDENT')"
      >
        Как студент
      </button>
    </div>

    <div v-if="tab === 'my'" class="flex rounded-xl bg-telegram-secondary/70 p-1 mb-4">
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          aboutMeRole === 'TUTOR'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchAboutMeRole('TUTOR')"
      >
        О репетиторах
      </button>
      <button
        type="button"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          aboutMeRole === 'STUDENT'
            ? 'bg-telegram-bg text-telegram-text shadow'
            : 'text-telegram-textSecondary'
        "
        @click="switchAboutMeRole('STUDENT')"
      >
        О студентах
      </button>
    </div>

    <div v-if="loading" class="text-center py-8 text-telegram-textSecondary">
      Загрузка...
    </div>

    <template v-else>
      <div v-if="reviews.length === 0" class="py-8">
        <Card class="p-6 text-center">
          <p class="text-telegram-textSecondary">
            {{
              tab === 'about-me'
                ? (aboutMeRole === 'TUTOR'
                    ? 'Пока нет отзывов о вас как о репетиторе.'
                    : 'Пока нет отзывов о вас как о студенте.')
                : (aboutMeRole === 'TUTOR'
                    ? 'Вы ещё не оставляли отзывов о репетиторах.'
                    : 'Вы ещё не оставляли отзывов о студентах.')
            }}
          </p>
        </Card>
      </div>
      <div v-else class="space-y-3">
        <ReviewCard
          v-for="review in reviews"
          :key="review.id"
          :review="review"
        />
      </div>
    </template>
  </div>
</template>
