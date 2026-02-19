<script setup lang="ts">
import { FavoriteCard, FavoritesEmptyState } from './ui'
import { useFavorites } from './hooks'

const { favorites, isLoading, handleRemoveFavorite, goToTutorsList } = useFavorites()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Избранное</h1>
      <p class="text-telegram-textSecondary">Репетиторы, которых вы добавили в избранное</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>

    <div v-else-if="favorites.length > 0" class="space-y-4">
      <FavoriteCard
        v-for="tutor in favorites"
        :key="tutor.id"
        :tutor="tutor"
        @remove="handleRemoveFavorite"
      />
    </div>

    <FavoritesEmptyState v-else :on-find-tutors="goToTutorsList" />
  </div>
</template>
