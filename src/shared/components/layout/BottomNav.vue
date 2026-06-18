<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

type Tab = 'market' | 'deals' | 'profile'

const tabs: { id: Tab; label: string; path: string }[] = [
  { id: 'market', label: 'Маркет', path: PATHS.MARKET },
  { id: 'deals', label: 'Сделки', path: PATHS.DEALS },
  { id: 'profile', label: 'Профиль', path: PATHS.PROFILE },
]

// иммерсивные под-экраны (деталь/отклик) без таб-бара, как в дизайне
const showNav = computed(
  () => route.name === 'market' || route.name === 'deals' || route.name === 'profile',
)

const activeTab = computed<Tab>(() => {
  if (route.path.startsWith(PATHS.DEALS)) return 'deals'
  if (route.path.startsWith(PATHS.PROFILE)) return 'profile'
  return 'market'
})

const navigateTo = (path: string) => {
  telegramStore.hapticFeedback('light')
  router.push(path)
}
</script>

<template>
  <nav
    v-if="showNav"
    class="shrink-0 z-40 flex gap-1.5 bg-d-panel border-t border-d-border px-3 pt-2.5 pb-[max(26px,env(safe-area-inset-bottom))]"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="press flex-1 flex flex-col items-center gap-1.5 py-2 rounded-[14px] transition-colors"
      :class="
        activeTab === tab.id ? 'text-d-accent bg-d-accent/[0.14]' : 'text-d-text-hint bg-transparent'
      "
      @click="navigateTo(tab.path)"
    >
      <svg
        v-if="tab.id === 'market'"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
      <svg
        v-else-if="tab.id === 'deals'"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m11 17 2 2 5-5" />
        <path d="M3 9l4-4 5 3 5-3 4 4-4 5-5-2-5 2-4-5Z" />
      </svg>
      <svg
        v-else
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <span class="text-[11px] font-semibold tracking-[0.01em]">{{ tab.label }}</span>
    </button>
  </nav>
</template>
