<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, Button, Input } from '@/shared/components/ui'
import { useTutorsList } from './hooks'
import type { Tutor } from './models'

const router = useRouter()
const {
  searchQuery,
  educationLoading,
  educationError,
  initialize,
  isLoading,
  error,
  tutors,
  totalTutors,
  currentPage,
  totalPages,
  availableSubjects,
  pageTitle,
  loadTutors,
  goToPage,
  goBack,
  selectSubject,
} = useTutorsList()

const viewTutor = (tutor: Tutor) => {
  router.push(`/student/services?subject=${encodeURIComponent(tutor.name || '')}`)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center mb-6">
      <Button variant="secondary" size="sm" @click="goBack" class="mr-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </Button>
      <div>
        <h1 class="text-2xl font-bold text-telegram-text">{{ pageTitle }}</h1>
        <p class="text-telegram-textSecondary">{{ totalTutors }} репетиторов найдено</p>
      </div>
    </div>
    <div v-if="educationLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button @click="initialize" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Попробовать снова</button>
    </div>
    <div v-else>
      <Input v-model="searchQuery" placeholder="Поиск по имени, предмету..." class="w-full mb-4" @keyup.enter="loadTutors" />
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button @click="selectSubject(null)" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-telegram-secondary text-telegram-text">Все</button>
        <button v-for="s in availableSubjects" :key="s" @click="selectSubject(s)" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-telegram-secondary text-telegram-text">{{ s }}</button>
      </div>
      <div v-if="isLoading" class="flex justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-accent"></div></div>
      <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
      <div v-else-if="tutors.length === 0" class="text-center py-12 text-telegram-textSecondary">Репетиторы не найдены</div>
      <div v-else class="space-y-4">
        <Card v-for="tutor in tutors" :key="tutor.id" class="p-4 cursor-pointer hover:border-telegram-accent" @click="viewTutor(tutor)">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold">{{ tutor.name?.charAt(0) || 'Р' }}</div>
              <div>
                <h3 class="font-semibold text-telegram-text">{{ tutor.name }}</h3>
                <p class="text-sm text-telegram-textSecondary">{{ tutor.description || 'Репетитор' }}</p>
              </div>
            </div>
            <Button size="sm" @click.stop="viewTutor(tutor)">Выбрать</Button>
          </div>
        </Card>
      </div>
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
        <Button variant="ghost" size="sm" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">Назад</Button>
        <span class="py-2 text-telegram-textSecondary">{{ currentPage }} / {{ totalPages }}</span>
        <Button variant="ghost" size="sm" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">Вперёд</Button>
      </div>
    </div>
  </div>
</template>
