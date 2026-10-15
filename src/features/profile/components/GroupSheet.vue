<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BottomSheet, SearchField } from '@/shared/components/ui'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'

interface Props {
  /** id текущей группы пользователя */
  currentId?: string
}
defineProps<Props>()

const open = defineModel<boolean>({ required: true })

const telegramStore = useTelegramStore()
const emit = defineEmits<{ pick: [groupId: string] }>()

const { groups } = useEducation()

const query = ref('')

// «ивт21» находит «ИВТ-21-1»: дефисы, пробелы и регистр при поиске не важны
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

const visibleGroups = computed(() => {
  const q = normalize(query.value)
  if (!q) return groups.value
  const matches = groups.value.filter((group) => normalize(group.number).includes(q))
  // набирают номер с начала: «43» — это 4312 и 4333, а 4432 ниже. sort стабилен,
  // так что внутри каждой половины остаётся алфавитный порядок с бэкенда
  return matches.sort(
    (a, b) =>
      Number(!normalize(a.number).startsWith(q)) - Number(!normalize(b.number).startsWith(q)),
  )
})

// лист открывают заново — прошлый поиск к новому выбору не относится
watch(open, (isOpen) => {
  if (!isOpen) query.value = ''
})

const pick = (groupId: string) => {
  telegramStore.hapticFeedback('light')
  open.value = false
  emit('pick', groupId)
}
</script>

<template>
  <BottomSheet v-model="open" title="Выберите группу" tall>
    <template #header>
      <SearchField v-model="query" placeholder="Номер группы" />
    </template>

    <button
      v-for="group in visibleGroups"
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
    <p v-else-if="!visibleGroups.length" class="text-subhead text-d-text-hint py-4">
      Группы «{{ query }}» нет — проверьте номер
    </p>
  </BottomSheet>
</template>
