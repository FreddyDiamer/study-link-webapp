<script setup lang="ts">
interface Props {
  title: string
  /** показывать кнопку сброса фильтра (в макете — когда фильтр реально сужает выдачу) */
  filtered?: boolean
}
withDefaults(defineProps<Props>(), { filtered: false })

const emit = defineEmits<{ reset: [] }>()
</script>

<template>
  <div class="reveal flex flex-col items-center text-center px-5 pt-11 pb-5">
    <div
      class="w-14 h-14 rounded-full bg-d-panel border border-d-border flex items-center justify-center mb-3.5"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5B6472"
        stroke-width="1.7"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
    </div>
    <div class="text-[16px] font-semibold mb-1.5">{{ title }}</div>
    <div class="text-subhead text-d-text-hint mb-4">
      Попробуйте другой предмет или сбросьте фильтр.
    </div>
    <button
      v-if="filtered"
      class="press px-5 py-2.5 rounded-[12px] bg-d-panel border border-d-border text-d-act text-subhead font-semibold"
      @click="emit('reset')"
    >
      Сбросить фильтр
    </button>
  </div>
</template>
