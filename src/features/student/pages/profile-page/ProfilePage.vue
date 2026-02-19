<script setup lang="ts">
import { ProfileCard, FeedbackCard } from './ui'
import { useProfile } from './hooks'

const { user, isLoading, openFeedback, telegramStore } = useProfile()
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

    <FeedbackCard :on-click="openFeedback" />
  </div>
</template>
