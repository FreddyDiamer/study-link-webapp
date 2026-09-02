<script setup lang="ts">
import { BottomSheet } from '@/shared/components/ui'
import { useEducation } from '@/shared/composables'

interface Props {
  /** id текущей группы пользователя */
  currentId?: string
}
defineProps<Props>()

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ pick: [groupId: string] }>()

const { groups } = useEducation()

const pick = (groupId: string) => {
  open.value = false
  emit('pick', groupId)
}
</script>

<template>
  <BottomSheet v-model="open" title="Выберите группу" scrollable>
    <button
      v-for="group in groups"
      :key="group.id"
      class="press flex items-center px-1 py-3.5 border-b border-d-border text-left"
      @click="pick(group.id)"
    >
      <span
        class="text-[16px] font-semibold"
        :class="group.id === currentId ? 'text-d-accent' : ''"
      >
        {{ group.number }}
      </span>
      <span v-if="group.id === currentId" class="ml-auto text-d-accent text-[17px] font-bold"
        >✓</span
      >
    </button>
    <p v-if="!groups.length" class="text-subhead text-d-text-hint py-4">Список групп пуст</p>
  </BottomSheet>
</template>
