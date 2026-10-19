<script setup lang="ts">
import { ROLE_META } from '@/shared/constants'
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
        class="shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center text-[20px] font-bold"
        :class="ROLE_META.customer.soft"
        >?</span
      >
      <span>
        <span class="block text-[15px] font-semibold">Нужна помощь</span>
        <span class="block text-caption text-d-text-hint mt-0.5"
          >Создать заявку · <span :class="ROLE_META.customer.text">вы заказчик</span></span
        >
      </span>
    </button>

    <button
      class="press w-full flex items-center gap-3 bg-d-ink border border-d-border rounded-[14px] p-[15px] text-left"
      @click="pick('service')"
    >
      <span
        class="shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center text-[19px] font-bold"
        :class="ROLE_META.worker.soft"
        >✎</span
      >
      <span>
        <span class="block text-[15px] font-semibold">Могу помочь</span>
        <span class="block text-caption text-d-text-hint mt-0.5"
          >Предложить услугу · <span :class="ROLE_META.worker.text">вы исполнитель</span></span
        >
      </span>
    </button>
  </BottomSheet>
</template>
