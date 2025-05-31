<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const telegramStore = useTelegramStore()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Профиль</h1>
      <p class="text-telegram-textSecondary">Управляйте своим профилем и настройками</p>
    </div>

    <!-- Profile info -->
    <Card class="p-6 mb-6">
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ telegramStore.firstName?.charAt(0) || 'У' }}
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-telegram-text">
            {{ telegramStore.firstName || 'Пользователь' }} {{ telegramStore.lastName || '' }}
          </h2>
          <p class="text-telegram-textSecondary">@{{ telegramStore.username || 'username' }}</p>
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

      <Button variant="ghost" class="w-full"> Редактировать профиль </Button>
    </Card>

    <!-- Menu items -->
    <div class="space-y-3">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-telegram-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium">Настройки</p>
              <p class="text-telegram-textSecondary text-sm">Уведомления и предпочтения</p>
            </div>
          </div>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-telegram-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium">Помощь</p>
              <p class="text-telegram-textSecondary text-sm">Центр поддержки и FAQ</p>
            </div>
          </div>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-telegram-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-telegram-text font-medium">О приложении</p>
              <p class="text-telegram-textSecondary text-sm">Версия 1.0.0</p>
            </div>
          </div>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </div>
  </div>
</template>
