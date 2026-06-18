<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = useId()
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="inputId"
      class="block text-caption font-semibold text-d-text-second"
    >
      {{ label }}
      <span v-if="required" class="text-d-coral">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- Prepend slot -->
      <div v-if="$slots.prepend" class="absolute left-3 z-10 flex items-center">
        <slot name="prepend" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input"
        :class="{
          'pl-10': $slots.prepend,
          'pr-10': $slots.append,
        }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- Append slot -->
      <div v-if="$slots.append" class="absolute right-3 z-10 flex items-center">
        <slot name="append" />
      </div>
    </div>

    <p v-if="error" class="text-caption text-d-coral">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Стилизация значка календаря для input[type="date"] */
input[type='date'] {
  color-scheme: dark;
}
</style>
