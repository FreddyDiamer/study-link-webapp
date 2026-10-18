<script setup lang="ts">
import { computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import type { SubjectOption } from '@/shared/types'

interface Props {
  /** по порядку: предметы вашей группы, потом те, по которым что-то есть в ленте */
  subjects: readonly SubjectOption[]
}
const props = defineProps<Props>()

/** '' — «Все»; иначе id предмета */
const model = defineModel<string>({ required: true })

const telegramStore = useTelegramStore()

const pick = (id: string) => {
  if (model.value === id) return
  telegramStore.hapticFeedback('light')
  model.value = id
}

const chips = computed(() => [
  { id: '', name: 'Все' },
  ...props.subjects.map((s) => ({ id: s.id, name: s.name })),
])
</script>

<template>
  <div class="flex gap-2 overflow-x-auto -mx-[18px] px-[18px] py-0.5">
    <button
      v-for="chip in chips"
      :key="chip.id || 'all'"
      class="press shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold whitespace-nowrap transition-colors duration-200"
      :class="model === chip.id ? 'bg-d-accent text-d-ink' : 'bg-d-panel text-d-text-second'"
      @click="pick(chip.id)"
    >
      {{ chip.name }}
    </button>
  </div>
</template>
