<script setup lang="ts" generic="T extends string">
import { computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { ROLE_META, type Role } from '@/shared/constants'

interface Props {
  /** ровно два сегмента — как во всех переключателях макета */
  /** role — сегмент про роль пользователя: активная половина красится её цветом */
  items: readonly { id: T; label: string; role?: Role }[]
}
const props = defineProps<Props>()

const model = defineModel<T>({ required: true })

const telegramStore = useTelegramStore()

const pillClass = computed(() => {
  const role = props.items.find((item) => item.id === model.value)?.role
  return role ? ROLE_META[role].solid : 'bg-d-accent'
})

// отклик даём в момент касания, а не после ответа сервера
const pick = (id: T) => {
  if (model.value === id) return
  telegramStore.hapticFeedback('light')
  model.value = id
}
</script>

<template>
  <div class="relative flex h-11 p-1 bg-d-panel border border-d-border rounded-field">
    <span
      class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-chip transition-[transform,background-color] duration-300 ease-d-spring"
      :class="pillClass"
      :style="{ transform: model === props.items[0]?.id ? 'translateX(0)' : 'translateX(100%)' }"
    />
    <button
      v-for="item in items"
      :key="item.id"
      class="relative z-[2] flex-1 flex items-center justify-center text-subhead font-semibold transition-colors duration-200"
      :class="model === item.id ? 'text-d-ink' : 'text-d-text-second'"
      @click="pick(item.id)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
