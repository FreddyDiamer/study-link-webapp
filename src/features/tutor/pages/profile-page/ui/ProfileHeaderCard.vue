<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { User } from '@/shared/types'

defineProps<{
  user: User | null
  isLoading: boolean
  firstName?: string
  username?: string
}>()

defineEmits<{
  editProfile: []
}>()
</script>

<template>
  <Card class="p-6 mb-6">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>
    <template v-else-if="user">
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-16 h-16 bg-telegram-success rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ user.name?.charAt(0) || firstName?.charAt(0) || 'Р' }}
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-telegram-text">
            {{ user.name || firstName || 'Репетитор' }}
          </h2>
          <p class="text-telegram-textSecondary">
            @{{ user.telegramUsername || username || 'username' }}
          </p>
          <div class="inline-flex items-center mt-2 px-2 py-1 bg-telegram-success/10 rounded-lg">
            <svg
              class="w-4 h-4 text-telegram-success mr-1"
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
            <span class="text-telegram-success text-sm font-medium">Репетитор</span>
          </div>
        </div>
      </div>
    </template>
    <Button variant="ghost" class="w-full" @click="$emit('editProfile')">
      Редактировать профиль
    </Button>
  </Card>
</template>
