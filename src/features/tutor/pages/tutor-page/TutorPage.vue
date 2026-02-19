<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, Input, Button } from '@/shared/components/ui'
import { LoupeIcon } from '@/shared/components/icons'
import { ActiveServicesList } from './ui'
import { useTutorPage } from './hooks'
import { PATHS } from '@/router/paths'

const router = useRouter()
const { searchQuery, isLoading, activeServices, quickActions } = useTutorPage()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <Card class="p-4 mb-6">
      <div class="space-y-3">
        <Input v-model="searchQuery" placeholder="Поиск заказов по предметам, преподавателям..." class="w-full">
          <template #prepend><LoupeIcon /></template>
        </Input>
        <Button class="w-full" size="sm" @click="router.push(PATHS.TUTOR_ORDERS)">Найти заказ</Button>
      </div>
    </Card>
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-telegram-text mb-3">Быстрые действия</h2>
      <div class="space-y-3">
        <Card v-for="action in quickActions" :key="action.title" @click="action.action" class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200">
          <div class="flex items-center space-x-4">
            <div :class="[action.color, 'w-12 h-12 rounded-xl flex items-center justify-center']">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-telegram-text font-medium">{{ action.title }}</h3>
              <p class="text-telegram-textSecondary text-sm">{{ action.description }}</p>
            </div>
            <svg class="w-5 h-5 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Card>
      </div>
    </div>
    <div class="mb-6">
      <ActiveServicesList :services="activeServices" :is-loading="isLoading" />
    </div>
  </div>
</template>
