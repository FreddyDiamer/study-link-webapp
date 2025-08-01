<script setup lang="ts">
import { computed } from 'vue'
import { useEducation } from '@/shared/composables'

interface Props {
  modelValue?: string
  placeholder?: string
  showAll?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите предмет',
  showAll: true,
})

const emit = defineEmits<Emits>()

const { activeSubjects, isLoading, error } = useEducation()

const selectedSubject = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value),
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedSubject.value = target.value
}
</script>

<template>
  <div class="relative">
    <!-- Загрузка -->
    <div v-if="isLoading" class="flex items-center space-x-2 text-sm text-gray-500">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Загрузка предметов...</span>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-sm text-red-600">Ошибка загрузки предметов</div>

    <!-- Селект -->
    <select
      v-else
      :value="selectedSubject"
      @change="handleChange"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :disabled="isLoading"
    >
      <option v-if="showAll" value="">{{ placeholder }}</option>
      <option v-for="subject in activeSubjects" :key="subject.id" :value="subject.id">
        {{ subject.name }}
      </option>
    </select>
  </div>
</template>
