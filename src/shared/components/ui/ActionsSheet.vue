<script setup lang="ts">
import BottomSheet from './BottomSheet.vue'
import { useTelegramStore } from '@/stores/telegram'

export interface SheetAction {
  id: string
  label: string
  icon: string
  /** разрушительное действие — единственное красное на экран, всегда внизу */
  destructive?: boolean
}

interface Props {
  title?: string
  actions: SheetAction[]
}
withDefaults(defineProps<Props>(), { title: 'Действия' })

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ pick: [id: string] }>()

const telegramStore = useTelegramStore()

const pick = (action: SheetAction) => {
  telegramStore.hapticFeedback(action.destructive ? 'medium' : 'light')
  open.value = false
  emit('pick', action.id)
}
</script>

<template>
  <BottomSheet v-model="open" :title="title">
    <button
      v-for="action in actions"
      :key="action.id"
      class="press w-full flex items-center gap-3 bg-d-ink border border-d-border rounded-[14px] px-4 py-3.5 mb-2.5 text-left text-body"
      :class="action.destructive ? 'text-d-coral' : 'text-d-text'"
      @click="pick(action)"
    >
      <span class="shrink-0 w-5 text-center text-d-text-hint">{{ action.icon }}</span>
      {{ action.label }}
    </button>

    <button
      class="press w-full h-12 rounded-[14px] text-subhead font-semibold text-d-text-second"
      @click="open = false"
    >
      Отмена
    </button>
  </BottomSheet>
</template>
