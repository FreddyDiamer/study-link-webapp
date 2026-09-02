<script setup lang="ts">
import { BottomSheet } from '@/shared/components/ui'

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ pick: [reason: string] }>()

// причину видит вторая сторона, поэтому формулировки нейтральные
const REASONS = [
  'Не совпало расписание',
  'Договорились не проводить занятие',
  'Не вышли на связь',
  'Другая причина',
]

const pick = (reason: string) => {
  open.value = false
  emit('pick', reason)
}
</script>

<template>
  <BottomSheet v-model="open" title="Почему отменяете?" sub="Причину увидит вторая сторона">
    <button
      v-for="reason in REASONS"
      :key="reason"
      class="press w-full text-left bg-d-ink border border-d-border rounded-[14px] px-4 py-3.5 mb-2.5 text-body"
      @click="pick(reason)"
    >
      {{ reason }}
    </button>
  </BottomSheet>
</template>
