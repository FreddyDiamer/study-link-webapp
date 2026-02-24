<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ProfileCard, FeedbackCard } from './ui'
import { useProfile } from './hooks'
import Card from '@/shared/components/ui/Card.vue'
import { PATHS } from '@/router/paths'

const router = useRouter()
const { user, isLoading, openFeedback, telegramStore } = useProfile()

function openNotifications() {
  router.push(PATHS.STUDENT_NOTIFICATIONS)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Профиль</h1>
      <p class="text-telegram-textSecondary">Управляйте своим профилем и настройками</p>
    </div>

    <ProfileCard
      :user="user"
      :is-loading="isLoading"
      :first-name="telegramStore.firstName"
      :username="telegramStore.username"
    />

    <Card
      class="p-4 mt-3 cursor-pointer hover:border-telegram-accent transition-colors"
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

    <FeedbackCard :on-click="openFeedback" />
  </div>
</template>
