<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import type { StatItem } from '../models'

defineProps<{
  stats: StatItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mb-6 mt-6">
    <Card v-for="stat in stats" :key="stat.label" class="p-4 text-center">
      <div class="text-2xl mb-2">{{ stat.icon }}</div>
      <div class="text-2xl font-bold text-telegram-text mb-1">{{ stat.value }}</div>
      <div class="text-telegram-textSecondary text-sm">{{ stat.label }}</div>
    </Card>
  </div>
</template>
