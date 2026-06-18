<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS, serviceDetailPath } from '@/router/paths'

interface Props {
  title: string
  sub?: string
  back?: boolean
  reload?: boolean
  add?: boolean
}
const props = withDefaults(defineProps<Props>(), { back: false, reload: false, add: false })
const emit = defineEmits<{ reload: []; add: [] }>()

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

const goBack = () => {
  telegramStore.hapticFeedback('light')
  if (route.name === 'service-respond' && route.params.id) {
    router.push(serviceDetailPath(route.params.id as string))
  } else {
    router.push(PATHS.MARKET)
  }
}

const onReload = () => {
  telegramStore.hapticFeedback('light')
  emit('reload')
}

const onAdd = () => {
  telegramStore.hapticFeedback('light')
  emit('add')
}
</script>

<template>
  <header
    class="shrink-0 flex items-center gap-3 px-4 pt-1.5 pb-3.5 border-b border-d-sk-base"
  >
    <!-- back -->
    <button
      v-if="back"
      class="press shrink-0 w-10 h-10 rounded-[12px] bg-d-panel border border-d-border flex items-center justify-center text-d-accent text-2xl leading-none"
      aria-label="Назад"
      @click="goBack"
    >
      ‹
    </button>
    <!-- logo -->
    <span
      v-else
      class="shrink-0 w-10 h-10 rounded-[12px] bg-d-accent flex items-center justify-center shadow-d-logo"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" fill="#0E0F13" />
        <path
          d="M6.5 11.2V15c0 1 2.5 2.2 5.5 2.2s5.5-1.2 5.5-2.2v-3.8"
          stroke="#0E0F13"
          stroke-width="1.7"
        />
      </svg>
    </span>

    <div class="flex-1 min-w-0">
      <div class="text-[19px] font-bold tracking-[-0.015em] leading-[1.15] truncate">
        {{ title }}
      </div>
      <div v-if="sub" class="text-[12px] text-d-text-hint leading-[1.2] mt-px truncate">
        {{ sub }}
      </div>
    </div>

    <button
      v-if="add"
      class="press shrink-0 w-10 h-10 rounded-[12px] bg-d-accent text-d-ink flex items-center justify-center text-[26px] leading-none font-light shadow-d-logo"
      aria-label="Добавить услугу"
      @click="onAdd"
    >
      +
    </button>
    <button
      v-if="reload"
      class="press shrink-0 w-10 h-10 rounded-[12px] bg-d-panel border border-d-border flex items-center justify-center text-d-text-second text-[18px]"
      aria-label="Обновить"
      @click="onReload"
    >
      ↻
    </button>
  </header>
</template>
