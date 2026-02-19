<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import type { User } from '../models'

defineProps<{
  user: User | null
  isLoading: boolean
  firstName?: string
  username?: string
}>()
</script>

<template>
  <Card class="p-6 mb-6">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>

    <div v-else-if="user" class="flex items-center space-x-4">
      <div
        class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold"
      >
        {{ user.name?.charAt(0) || firstName?.charAt(0) || 'У' }}
      </div>

      <div class="flex-1">
        <h2 class="text-xl font-semibold text-telegram-text">
          {{ user.name || firstName || 'Пользователь' }}
        </h2>
        <p class="text-telegram-textSecondary">
          @{{ user.telegramUsername || username || 'username' }}
        </p>
        <div class="inline-flex items-center mt-2 px-2 py-1 bg-telegram-button/10 rounded-lg">
          <svg
            class="w-4 h-4 text-telegram-button mr-1"
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
          <span class="text-telegram-button text-sm font-medium">Студент</span>
        </div>
      </div>
    </div>
  </Card>
</template>
