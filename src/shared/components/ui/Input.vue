<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-telegram-text">
      {{ label }}
      <span v-if="required" class="text-telegram-destructive">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="text-sm text-telegram-destructive">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
</script>
