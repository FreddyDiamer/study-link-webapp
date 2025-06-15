<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const telegramStore = useTelegramStore()

interface NavItem {
  path: string
  label: string
  icon: string
  activeIcon?: string
  badge?: number
}

const studentNavItems: NavItem[] = [
  {
    path: PATHS.STUDENT,
    label: 'Поиск',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    path: PATHS.STUDENT_SERVICES,
    label: 'Услуги',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    path: PATHS.STUDENT_ORDERS,
    label: 'Мои заказы',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    badge: 2,
  },
  {
    path: '/student/profile',
    label: 'Профиль',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

const tutorNavItems: NavItem[] = [
  {
    path: '/tutor',
    label: 'Главная',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    path: '/tutor/services',
    label: 'Услуги',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    path: '/tutor/orders',
    label: 'Заказы',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
  {
    path: '/tutor/requests',
    label: 'Заявки',
    icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  },
  {
    path: '/tutor/profile',
    label: 'Профиль',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

const currentNavItems = computed(() => {
  if (appStore.isStudentFlow) return studentNavItems
  if (appStore.isTutorFlow) return tutorNavItems
  return []
})

const navigateTo = (path: string) => {
  telegramStore.hapticFeedback('light')
  router.push(path)
}

const isActiveRoute = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}
</script>

<template>
  <nav
    v-if="appStore.currentFlow && currentNavItems.length > 0"
    class="fixed bottom-0 left-0 right-0 bg-telegram-card border-t border-telegram-border z-40"
  >
    <div class="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
      <button
        v-for="item in currentNavItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-all duration-200"
        :class="{
          'text-telegram-accent': isActiveRoute(item.path),
          'text-telegram-textSecondary hover:text-telegram-text': !isActiveRoute(item.path),
        }"
      >
        <!-- Icon -->
        <div
          class="w-6 h-6 mb-1 transition-transform duration-200 relative"
          :class="{ 'scale-110': isActiveRoute(item.path) }"
        >
          <svg
            class="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :stroke-width="isActiveRoute(item.path) ? '2.5' : '2'"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          <!-- Badge -->
          <div
            v-if="item.badge && item.badge > 0 && !isActiveRoute(item.path)"
            class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold min-w-4"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </div>
        </div>

        <!-- Label -->
        <span
          class="text-xs font-medium leading-none transition-all duration-200"
          :class="{
            'font-semibold': isActiveRoute(item.path),
          }"
        >
          {{ item.label }}
        </span>

        <!-- Active indicator -->
        <div
          v-if="isActiveRoute(item.path)"
          class="w-1 h-1 bg-telegram-accent rounded-full mt-1 animate-pulse"
        ></div>
      </button>
    </div>
  </nav>

  <!-- Bottom padding for content when navbar is visible -->
  <div
    v-if="appStore.currentFlow && currentNavItems.length > 0"
    class="h-20 safe-area-inset-bottom"
  ></div>
</template>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
