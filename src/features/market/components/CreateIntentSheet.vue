<script setup lang="ts">
import { BottomSheet } from '@/shared/components/ui'
import { useTelegramStore } from '@/stores/telegram'

const open = defineModel<boolean>({ required: true })

const telegramStore = useTelegramStore()
const emit = defineEmits<{ request: []; service: [] }>()

const pick = (intent: 'request' | 'service') => {
  telegramStore.hapticFeedback('light')
  open.value = false
  if (intent === 'request') emit('request')
  else emit('service')
}
</script>

<template>
  <BottomSheet v-model="open" title="Что вы хотите сделать?" sub="Роль зависит от намерения">
    <button
      class="press w-full flex items-center gap-3 bg-d-ink border border-d-border rounded-[14px] p-[15px] mb-2.5 text-left"
      @click="pick('request')"
    >
      <span
        class="shrink-0 w-10 h-10 rounded-[12px] bg-d-rating/[0.14] text-d-rating flex items-center justify-center text-[20px] font-bold"
        >?</span
      >
      <span>
        <span class="block text-[15px] font-semibold">Нужна помощь</span>
        <span class="block text-caption text-d-text-hint mt-0.5">Создать заявку · вы заказчик</span>
      </span>
    </button>

    <button
      class="press w-full flex items-center gap-3 bg-d-ink border border-d-border rounded-[14px] p-[15px] text-left"
      @click="pick('service')"
    >
      <span
        class="shrink-0 w-10 h-10 rounded-[12px] bg-d-accent/[0.16] text-d-accent flex items-center justify-center text-[19px] font-bold"
        >✎</span
      >
      <span>
        <span class="block text-[15px] font-semibold">Могу помочь</span>
        <span class="block text-caption text-d-text-hint mt-0.5"
          >Предложить услугу · вы исполнитель</span
        >
      </span>
    </button>
  </BottomSheet>
</template>
