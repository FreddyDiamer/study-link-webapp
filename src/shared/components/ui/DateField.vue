<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label?: string
  /** нижняя граница в формате поля (YYYY-MM-DD): календарь не даст выбрать раньше */
  min?: string
  /** ошибка этого поля — красит рамку и читается скринридером */
  error?: string
}
withDefaults(defineProps<Props>(), { label: 'Дедлайн', min: undefined, error: '' })

const model = defineModel<string>({ required: true })

const errorId = `${useId()}-error`
</script>

<template>
  <div>
    <label
      class="flex items-center h-[54px] rounded-[12px] bg-d-panel border px-4 cursor-pointer transition-colors"
      :class="error ? 'border-d-coral' : 'border-d-border-soft focus-within:border-d-act'"
    >
      <span class="text-body text-d-text-second">{{ label }}</span>
      <input
        v-model="model"
        type="date"
        :min="min"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="d-date ml-auto bg-transparent text-body text-right focus:outline-none"
        :class="model ? 'text-d-text' : 'text-d-text-hint'"
      />
    </label>
    <p v-if="error" :id="errorId" role="alert" class="text-caption text-d-coral mt-2">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* тёмный нативный календарь */
.d-date {
  color-scheme: dark;
}
</style>
