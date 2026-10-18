<script setup lang="ts">
import { computed, watch } from 'vue'
import BottomSheet from './BottomSheet.vue'
import SearchField from './SearchField.vue'

export interface PickerOption {
  id: string
  label: string
  /** вторая строка: у предмета — кто ведёт, у преподавателя — что ведёт */
  hint?: string
}

export interface PickerSection {
  key: string
  title?: string
  options: PickerOption[]
}

interface Props {
  title: string
  sub?: string
  placeholder: string
  sections: PickerSection[]
  currentId?: string | null
  /** идёт загрузка или серверный поиск */
  loading?: boolean
  failed?: boolean
  /** ничего не нашлось */
  emptyText?: string
  /** подсказка под списком: что ещё можно сделать */
  hint?: string
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  failed: false,
  currentId: null,
})

const open = defineModel<boolean>({ required: true })
const query = defineModel<string>('query', { default: '' })

const emit = defineEmits<{ pick: [option: PickerOption]; retry: [] }>()

const visibleSections = computed(() => props.sections.filter((s) => s.options.length))
const isEmpty = computed(() => !visibleSections.value.length)

// лист открывают заново — прошлый поиск к новому выбору не относится
watch(open, (isOpen) => {
  if (!isOpen) query.value = ''
})

const handlePick = (option: PickerOption) => {
  open.value = false
  emit('pick', option)
}
</script>

<template>
  <BottomSheet v-model="open" :title="title" :sub="sub" tall>
    <template #header>
      <SearchField v-model="query" :placeholder="placeholder" />
    </template>

    <section v-for="section in visibleSections" :key="section.key" class="flex flex-col">
      <h3 v-if="section.title" class="text-overline uppercase text-d-text-hint pt-3.5 pb-1">
        {{ section.title }}
      </h3>
      <button
        v-for="option in section.options"
        :key="option.id"
        type="button"
        class="press flex items-center gap-3 px-1 py-3 border-b border-d-border text-left"
        @click="handlePick(option)"
      >
        <span class="min-w-0 flex-1">
          <span
            class="block text-[16px] font-semibold"
            :class="option.id === currentId ? 'text-d-accent' : ''"
          >
            {{ option.label }}
          </span>
          <span v-if="option.hint" class="block text-caption text-d-text-hint truncate mt-0.5">
            {{ option.hint }}
          </span>
        </span>
        <span
          v-if="option.id === currentId"
          class="shrink-0 text-d-accent text-[17px] font-bold"
          aria-hidden="true"
          >✓</span
        >
      </button>
    </section>

    <div v-if="loading" class="flex justify-center py-5" aria-label="Загрузка">
      <span
        class="w-5 h-5 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <div v-else-if="failed" class="flex flex-col items-center gap-2.5 py-5 text-center">
      <p class="text-subhead text-d-text-hint">Не получилось загрузить список</p>
      <button
        type="button"
        class="press px-4 py-2 rounded-[12px] bg-d-surface border border-d-border text-d-accent text-subhead font-semibold"
        @click="emit('retry')"
      >
        ↻ Повторить
      </button>
    </div>

    <p v-else-if="isEmpty && emptyText" class="text-subhead text-d-text-hint py-5 text-center">
      {{ emptyText }}
    </p>

    <p v-if="hint && !loading" class="text-caption text-d-text-hint py-4 text-center">
      {{ hint }}
    </p>
  </BottomSheet>
</template>
