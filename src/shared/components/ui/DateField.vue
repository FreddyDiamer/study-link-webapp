<script setup lang="ts">
interface Props {
  label?: string
}
withDefaults(defineProps<Props>(), { label: 'Дедлайн' })

const model = defineModel<string>({ required: true })
</script>

<template>
  <label
    class="flex items-center h-[54px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 cursor-pointer focus-within:border-d-accent transition-colors"
  >
    <span class="text-body text-d-text-second">{{ label }}</span>
    <input
      v-model="model"
      type="date"
      class="d-date ml-auto bg-transparent text-body text-right focus:outline-none"
      :class="model ? 'text-d-text' : 'text-d-text-hint'"
    />
  </label>
</template>

<style scoped>
/* тёмный нативный календарь */
.d-date {
  color-scheme: dark;
}
</style>
