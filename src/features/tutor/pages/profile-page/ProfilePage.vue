<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import { ProfileHeaderCard, StatsGrid, FeedbackCard } from './ui'
import { useTutorProfile } from './hooks'
import { PATHS } from '@/router/paths'

const router = useRouter()
const {
  user,
  isLoading,
  stats,
  editProfile,
  openFeedback,
  telegramStore,
} = useTutorProfile()

function openReviews() {
  router.push(PATHS.TUTOR_REVIEWS)
}

function openNotifications() {
  router.push(PATHS.TUTOR_NOTIFICATIONS)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <ProfileHeaderCard
      :user="user"
      :is-loading="isLoading"
      :first-name="telegramStore.firstName"
      :username="telegramStore.username"
      @edit-profile="editProfile"
    />

    <StatsGrid :stats="stats" />

    <div class="space-y-3">
      <Card
        class="p-4 cursor-pointer hover:border-telegram-accent transition-colors"
        @click="openReviews"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-telegram-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg class="w-5 h-5 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
      <Card
        class="p-4 cursor-pointer hover:border-telegram-accent transition-colors"
        @click="openNotifications"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-telegram-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p class="text-telegram-textSecondary text-sm">Включить или отключить уведомления в Telegram</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </div>

    <FeedbackCard @click="openFeedback" />
  </div>
</template>
