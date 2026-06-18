<script setup lang="ts">
import { computed } from 'vue'
import { useEducation } from '@/shared/composables'

interface Props {
  modelValue?: string
  placeholder?: string
  showAll?: boolean
  subjectId?: string // Фильтр по предмету
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите преподавателя',
  showAll: true,
})

const emit = defineEmits<Emits>()

const { teachers, getTeachersBySubject, isLoading, error } = useEducation()

const selectedTeacher = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value),
})

// Фильтруем преподавателей по предмету, если указан subjectId
const filteredTeachers = computed(() => {
  if (props.subjectId) {
    return getTeachersBySubject(props.subjectId)
  }
  return teachers.value
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedTeacher.value = target.value
}
</script>

<template>
  <div class="relative">
    <!-- Загрузка -->
    <div v-if="isLoading" class="flex items-center space-x-2 text-subhead text-d-text-hint">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-d-accent"></div>
      <span>Загрузка преподавателей...</span>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-subhead text-d-coral">Ошибка загрузки преподавателей</div>

    <!-- Селект -->
    <select
      v-else
      :value="selectedTeacher"
      @change="handleChange"
      class="w-full px-3 py-2 bg-d-panel text-d-text border border-d-border rounded-field focus:outline-none focus:border-d-accent"
      :disabled="isLoading"
    >
      <option v-if="showAll" value="">{{ placeholder }}</option>
      <option v-for="teacher in filteredTeachers" :key="teacher.id" :value="teacher.id">
        {{ teacher.fullName }}
      </option>
    </select>
  </div>
</template>
