<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { Select, type SelectOption } from '@/shared/components/ui'
import type { DealFilters } from '../models'

defineProps<{
  filters: DealFilters
  availableSubjects: SelectOption[]
  availableTeachers: SelectOption[]
  sortOptions: SelectOption[]
  sortOrderOptions: SelectOption[]
}>()

const emit = defineEmits<{
  'update:filters': [value: DealFilters]
  reset: []
}>()
</script>

<template>
  <Card class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-telegram-text">Фильтры</h3>
      <Button variant="ghost" size="sm" @click="emit('reset')">Сбросить</Button>
    </div>
    <div class="space-y-4">
      <div>
        <Select
          label="Предмет"
          v-model:value="filters.subject"
          :options="availableSubjects"
          placeholder="Выберите предмет"
        />
      </div>
      <div>
        <Select
          label="Преподаватель"
          v-model:value="filters.teacher"
          :options="availableTeachers"
          placeholder="Выберите преподавателя"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <Select
            label="Сортировать"
            v-model:value="filters.sortBy"
            :options="sortOptions"
            placeholder="Выберите сортировку"
          />
        </div>
        <div>
          <Select
            label="Порядок"
            v-model:value="filters.sortOrder"
            :options="sortOrderOptions"
            placeholder="Выберите порядок"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
