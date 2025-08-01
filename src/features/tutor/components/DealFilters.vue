<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { Select, type SelectOption } from '@/shared/components/ui'

interface DealFilters {
  search: string
  subject: string | null
  teacher: string | null
  status: 'all' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  source: 'all' | 'request' | 'service'
  sortBy: 'price' | 'date' | 'deadline' | 'updated'
  sortOrder: 'asc' | 'desc'
}

interface Props {
  filters: DealFilters
  subjects: SelectOption[]
  teachers?: SelectOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: DealFilters]
}>()

const telegramStore = useTelegramStore()

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'ACCEPTED', label: 'Принят' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'COMPLETED', label: 'Завершен' },
  { value: 'CANCELLED', label: 'Отменен' },
]

const sourceOptions: SelectOption[] = [
  { value: 'all', label: 'Все источники' },
  { value: 'request', label: 'Заявки' },
  { value: 'service', label: 'Услуги' },
]

const sortOptions: SelectOption[] = [
  { value: 'date', label: 'По дате создания' },
  { value: 'price', label: 'По цене' },
  { value: 'deadline', label: 'По дедлайну' },
  { value: 'updated', label: 'По обновлению' },
]

const sortOrderOptions: SelectOption[] = [
  { value: 'desc', label: 'По убыванию' },
  { value: 'asc', label: 'По возрастанию' },
]

const updateFilters = (updates: Partial<DealFilters>) => {
  const newFilters = { ...props.filters, ...updates }
  emit('update:filters', newFilters)
}

const clearFilters = () => {
  telegramStore.hapticFeedback('light')
  const clearedFilters: DealFilters = {
    search: '',
    subject: null,
    teacher: null,
    status: 'all',
    source: 'all',
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
        placeholder="Поиск по предмету, студенту..."
        class="w-full"
      />

      <!-- Filters Row 1 -->
      <div class="grid grid-cols-2 gap-3">
        <Select
          :model-value="filters.subject"
          @update:model-value="(value) => updateFilters({ subject: value })"
          :options="subjects"
          placeholder="Предмет"
        />

        <Select
          :model-value="filters.status"
          @update:model-value="(value) => updateFilters({ status: value as DealFilters['status'] })"
          :options="statusOptions"
          placeholder="Статус"
        />
      </div>

      <!-- Filters Row 2 -->
      <div class="grid grid-cols-2 gap-3">
        <Select
          v-if="teachers"
          :model-value="filters.teacher"
          @update:model-value="(value) => updateFilters({ teacher: value })"
          :options="teachers"
          placeholder="Преподаватель"
        />

        <Select
          :model-value="filters.source"
          @update:model-value="(value) => updateFilters({ source: value as DealFilters['source'] })"
          :options="sourceOptions"
          placeholder="Источник"
        />
      </div>

      <!-- Filters Row 2 -->
      <div class="grid grid-cols-2 gap-3">
        <Select
          :model-value="filters.source"
          @update:model-value="(value) => updateFilters({ source: value as DealFilters['source'] })"
          :options="sourceOptions"
          placeholder="Источник"
        />

        <Select
          :model-value="filters.sortBy"
          @update:model-value="(value) => updateFilters({ sortBy: value as DealFilters['sortBy'] })"
          :options="sortOptions"
          placeholder="Сортировка"
        />
      </div>

      <!-- Sort Order -->
      <div class="flex items-center justify-between">
        <Select
          :model-value="filters.sortOrder"
          @update:model-value="
            (value) => updateFilters({ sortOrder: value as DealFilters['sortOrder'] })
          "
          :options="sortOrderOptions"
          placeholder="Порядок"
          class="w-32"
        />

        <Button variant="ghost" size="sm" @click="clearFilters"> Сбросить </Button>
      </div>
    </div>
  </Card>
</template>
