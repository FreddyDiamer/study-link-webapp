<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'

interface Props {
  label: string
  hint?: string
  disabled?: boolean
}
withDefaults(defineProps<Props>(), { disabled: false })

const model = defineModel<boolean>({ required: true })

const telegramStore = useTelegramStore()

const toggle = () => {
  telegramStore.hapticFeedback('light')
  model.value = !model.value
}
</script>

<template>
  <button
    class="press w-full flex items-center gap-3 text-left disabled:opacity-40"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="flex-1 min-w-0">
      <span class="block text-body">{{ label }}</span>
      <span v-if="hint" class="block text-caption text-d-text-hint mt-0.5">{{ hint }}</span>
    </span>
    <span
      class="shrink-0 w-[46px] h-[28px] rounded-full p-[3px] transition-colors duration-200"
      :class="model ? 'bg-d-accent' : 'bg-d-surface border border-d-border-soft'"
    >
      <span
        class="block w-[22px] h-[22px] rounded-full bg-white transition-transform duration-200 ease-d-spring"
        :class="model ? 'translate-x-[18px]' : 'translate-x-0'"
      />
    </span>
  </button>
</template>
