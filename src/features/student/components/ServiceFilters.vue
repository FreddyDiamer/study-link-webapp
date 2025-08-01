<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { Select, type SelectOption } from '@/shared/components/ui'

interface ServiceFilters {
  search: string
  subject: string | null
  teacher: string | null
  minPrice: number | undefined
  maxPrice: number | undefined
  sortBy: 'price' | 'date' | 'rating'
  sortOrder: 'asc' | 'desc'
}

interface Props {
  filters: ServiceFilters
  subjects: SelectOption[]
  teachers: SelectOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ServiceFilters]
}>()

const telegramStore = useTelegramStore()

const sortOptions: SelectOption[] = [
  { value: 'price', label: 'По цене' },
  { value: 'date', label: 'По дате' },
  { value: 'rating', label: 'По рейтингу' },
]

const sortOrderOptions: SelectOption[] = [
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
]

const updateFilters = (updates: Partial<ServiceFilters>) => {
  const newFilters = { ...props.filters, ...updates }
  emit('update:filters', newFilters)
}

const clearFilters = () => {
  telegramStore.hapticFeedback('light')
  const clearedFilters: ServiceFilters = {
    search: '',
    subject: null,
    teacher: null,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
  }
  emit('update:filters', clearedFilters)
}
</script>

<template>
  <Card class="p-4 mb-4">
    <div class="space-y-4">
      <!-- Search -->
      <Input
        :model-value="filters.search"
        @update:model-value="(value) => updateFilters({ search: value })"
        placeholder="Поиск по описанию, репетитору, предмету..."
        class="w-full"
      />

      <!-- Subject and Teacher filters -->
      <div class="grid grid-cols-2 gap-3">
        <Select
          :model-value="filters.subject"
          @update:model-value="(value) => updateFilters({ subject: value })"
          :options="subjects"
          placeholder="Предмет"
        />

        <Select
          :model-value="filters.teacher"
          @update:model-value="(value) => updateFilters({ teacher: value })"
          :options="teachers"
          placeholder="Преподаватель"
        />
      </div>

      <!-- Price filters -->
      <div class="grid grid-cols-2 gap-3">
        <Input
          :model-value="filters.minPrice?.toString() || ''"
          @update:model-value="
            (value) => updateFilters({ minPrice: value ? Number(value) : undefined })
          "
          placeholder="Мин. цена"
          type="number"
        />

        <Input
          :model-value="filters.maxPrice?.toString() || ''"
          @update:model-value="
            (value) => updateFilters({ maxPrice: value ? Number(value) : undefined })
          "
          placeholder="Макс. цена"
          type="number"
        />
      </div>

      <!-- Sort options -->
      <div class="grid grid-cols-2 gap-3">
        <Select
          :model-value="filters.sortBy"
          @update:model-value="
            (value) => updateFilters({ sortBy: value as ServiceFilters['sortBy'] })
          "
          :options="sortOptions"
          placeholder="Сортировка"
        />

        <Select
          :model-value="filters.sortOrder"
          @update:model-value="
            (value) => updateFilters({ sortOrder: value as ServiceFilters['sortOrder'] })
          "
          :options="sortOrderOptions"
          placeholder="Порядок"
        />
      </div>

      <!-- Clear filters -->
      <Button @click="clearFilters" variant="ghost" class="w-full"> Сбросить фильтры </Button>
    </div>
  </Card>
</template>
