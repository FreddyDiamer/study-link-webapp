<script setup lang="ts">
interface Props {
  /** «Это все заявки на сегодня» / «Это все услуги на сегодня» */
  label: string
}
defineProps<Props>()

const emit = defineEmits<{ createService: [] }>()
</script>

<template>
  <!-- лента должна кончаться намеренно, а не обрываться на второй карточке -->
  <div class="flex items-center gap-3 pt-2 pb-1">
    <span class="flex-1 h-px bg-d-border" />
    <span class="text-[11px] text-d-text-hint">{{ label }}</span>
    <span class="flex-1 h-px bg-d-border" />
  </div>

  <div class="bg-d-panel border border-d-border rounded-card p-4">
    <div class="text-[15px] font-semibold mb-1.5">Платформа только открылась</div>
    <p class="text-subhead text-d-text-second mb-4">
      Новые заявки появляются каждый день. Пока можно опубликовать свою услугу — её увидят первой.
    </p>
    <button
      class="press w-full h-11 rounded-[12px] bg-d-accent text-d-ink text-[15px] font-bold"
      @click="emit('createService')"
    >
      Предложить услугу
    </button>
  </div>
</template>
