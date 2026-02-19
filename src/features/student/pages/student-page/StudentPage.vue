<script setup lang="ts">
import { Button, Card, Input } from '@/shared/components/ui'
import { QuickActions, SelectGroupCard } from './ui'
import { useStudentPage } from './hooks'

const {
  searchQuery,
  educationLoading,
  educationError,
  initialize,
  search,
  appStore,
  authStore,
} = useStudentPage()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 flex flex-col gap-6">
    <SelectGroupCard v-if="appStore.showGroupCard || !authStore.user?.group" />

    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button
        @click="initialize"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>

    <div v-else class="space-y-5">
      <Card class="p-4">
        <div class="space-y-3">
          <Input
            v-model="searchQuery"
            placeholder="Поиск репетиторов, предметов..."
            class="w-full"
          />
          <Button @click="search" class="w-full" size="sm">Найти услугу</Button>
        </div>
      </Card>
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-telegram-text mb-4">Быстрые действия</h2>
        <QuickActions />
      </div>
    </div>
  </div>
</template>
