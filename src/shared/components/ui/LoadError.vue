<script setup lang="ts">
interface Props {
  title: string
  /** текст обязан сказать, что данные не потеряны — это пугает сильнее сбоя */
  text: string
  /** код и время последней попытки: мелким, для того, кто придёт в поддержку */
  code?: number | string
  at?: string
  /** компактный вид для блока внутри экрана */
  compact?: boolean
  loading?: boolean
}
withDefaults(defineProps<Props>(), { compact: false, loading: false })

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="reveal flex flex-col items-center text-center"
    :class="compact ? 'px-4 py-6' : 'px-5 pt-12 pb-5'"
  >
    <!-- знак «!» вместо «+»: отличие от пустоты начинается здесь -->
    <div
      class="rounded-full bg-d-panel border border-d-border flex items-center justify-center text-d-rating font-bold mb-3.5"
      :class="compact ? 'w-10 h-10 text-[18px]' : 'w-14 h-14 text-[22px]'"
    >
      !
    </div>
    <div class="text-[16px] font-semibold mb-1.5">{{ title }}</div>
    <p class="text-subhead text-d-text-hint mb-4">{{ text }}</p>

    <button
      class="press px-5 py-2.5 rounded-[12px] bg-d-panel border border-d-border text-d-accent text-subhead font-semibold disabled:opacity-40"
      :disabled="loading"
      @click="emit('retry')"
    >
      ↻ Повторить
    </button>

    <div v-if="code || at" class="text-[11px] text-d-text-mute mt-3">
      <span v-if="at">Последняя попытка {{ at }}</span>
      <span v-if="at && code"> · </span>
      <span v-if="code">ошибка {{ code }}</span>
    </div>
  </div>
</template>
