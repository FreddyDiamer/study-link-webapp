<script setup lang="ts">
interface Props {
  placeholder: string
}
defineProps<Props>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div
    class="flex items-center gap-2.5 h-11 rounded-[12px] bg-d-panel border border-d-border px-[15px] focus-within:border-d-border-hover transition-colors"
  >
    <svg
      class="shrink-0"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5B6472"
      stroke-width="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="flex-1 min-w-0 bg-transparent text-[15px] focus:outline-none placeholder:text-d-text-hint"
    />
  </div>
</template>
