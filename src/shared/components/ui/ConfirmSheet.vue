<script setup lang="ts">
import BottomSheet from './BottomSheet.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { useTelegramStore } from '@/stores/telegram'

interface Props {
  title: string
  /** что именно произойдёт — без «внимание» и восклицательных знаков */
  text: string
  confirmLabel: string
  cancelLabel?: string
  /** кого это коснётся: имена и лица честнее, чем «трое откликнувшихся» */
  affected?: { id: string; name: string }[]
  affectedTitle?: string
  /** строка, снимающая страх: что решение обратимо */
  reassurance?: string
  loading?: boolean
}
withDefaults(defineProps<Props>(), {
  cancelLabel: 'Отмена',
  affectedTitle: 'Кого это коснётся',
  loading: false,
})

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ confirm: [] }>()

const telegramStore = useTelegramStore()

const confirm = () => {
  telegramStore.hapticFeedback('medium')
  emit('confirm')
}

const namesLine = (people: { name: string }[]) => {
  const names = people.map((p) => p.name.split(' ')[0])
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} и ${names[names.length - 1]}`
}
</script>

<template>
  <BottomSheet v-model="open" :title="title">
    <p class="text-subhead text-d-text-second mb-4">{{ text }}</p>

    <div v-if="affected?.length" class="bg-d-ink border border-d-border rounded-[14px] p-3.5 mb-4">
      <div class="text-overline uppercase text-d-text-hint mb-2.5">{{ affectedTitle }}</div>
      <div class="flex items-center gap-2">
        <div class="flex -space-x-2">
          <AvatarChip v-for="person in affected" :key="person.id" :name="person.name" size="sm" />
        </div>
        <span class="text-caption text-d-text-second">{{ namesLine(affected) }}</span>
      </div>
    </div>

    <button
      class="press w-full h-[50px] rounded-[13px] bg-d-coral text-white text-[15px] font-bold mb-2 disabled:opacity-40"
      :disabled="loading"
      @click="confirm"
    >
      {{ confirmLabel }}
    </button>
    <button
      class="press w-full h-12 rounded-[13px] text-subhead font-semibold text-d-text-second"
      @click="open = false"
    >
      {{ cancelLabel }}
    </button>

    <p v-if="reassurance" class="text-caption text-d-text-hint text-center mt-2">
      {{ reassurance }}
    </p>
  </BottomSheet>
</template>
