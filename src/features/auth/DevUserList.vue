<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import type { DevUser } from '@/services/api/auth'

interface Props {
  /** уже отфильтрованные по введённому username */
  users: DevUser[]
  /** сколько пришло с бэкенда до фильтра */
  total: number
  /** что введено в поле: список сужается по нему */
  query: string
  loading?: boolean
  disabled?: boolean
  /** под кем из списка сейчас входим — у строки крутится спиннер */
  pendingId?: string | null
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  pendingId: null,
})
const emit = defineEmits<{ pick: [userId: string] }>()

const heading = computed(() =>
  props.query
    ? `Найдено · ${props.users.length} из ${props.total}`
    : `Пользователи · ${props.total}`,
)
</script>

<template>
  <section>
    <h2 class="text-overline uppercase text-d-text-hint mb-3 tnum">
      {{ loading ? 'Пользователи' : heading }}
    </h2>

    <div v-if="loading" class="flex flex-col gap-2" aria-hidden="true">
      <div v-for="n in 3" :key="n" class="skeleton h-[66px] rounded-card" />
    </div>

    <ul v-else-if="users.length" class="flex flex-col gap-2">
      <li v-for="user in users" :key="user.id">
        <button
          class="press w-full flex items-center gap-3 bg-d-panel border border-d-border rounded-card p-3 text-left hover:border-d-border-hover disabled:opacity-40"
          :disabled="disabled"
          @click="emit('pick', user.id)"
        >
          <AvatarChip :name="user.name || user.telegramUsername || user.id" size="md" />
          <span class="min-w-0 flex-1">
            <span class="block text-subhead font-semibold truncate">
              {{ user.name || 'Без имени' }}
            </span>
            <span v-if="user.telegramUsername" class="block text-caption text-d-text-hint truncate">
              @{{ user.telegramUsername }}
            </span>
          </span>
          <span
            v-if="pendingId === user.id"
            class="shrink-0 w-4 h-4 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>

    <!-- список — последние 100 по активности, бэкенд ищет по всей базе -->
    <p v-else-if="query" class="text-subhead text-d-text-hint text-center px-4 py-6">
      Среди загруженных нет «{{ query }}» — вход по username ищет по всей базе.
    </p>
    <p v-else class="text-subhead text-d-text-hint text-center py-6">Пользователей пока нет</p>
  </section>
</template>
