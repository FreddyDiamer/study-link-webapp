<script setup lang="ts">
// Vue
import type { Component } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Store
import { useAppStore } from '@/stores/app'
import { useTelegramStore } from '@/stores/telegram'

// Constants
import { PATHS } from '@/router/paths'
import { HomeIcon, ServiceIcon, OrderIcon, ProfileIcon } from '@components/icons'

// Composables
const route = useRoute()
const router = useRouter()

// Stores
const appStore = useAppStore()
const telegramStore = useTelegramStore()

// Types
interface NavItem {
  path: string
  label: string
  icon: Component
  activeIcon?: string
  badge?: number
}

// Data
const studentNavItems: NavItem[] = [
  {
    path: PATHS.STUDENT_MAIN,
    label: 'Главная',
    icon: HomeIcon,
  },
  {
    path: PATHS.STUDENT_SERVICES,
    label: 'Услуги',
    icon: ServiceIcon,
  },
  {
    path: PATHS.STUDENT_ORDERS,
    label: 'Мои заказы',
    icon: OrderIcon,
    badge: 2,
  },
  {
    path: PATHS.STUDENT_PROFILE,
    label: 'Профиль',
    icon: ProfileIcon,
  },
]

const tutorNavItems: NavItem[] = [
  {
    path: PATHS.TUTOR_MAIN,
    label: 'Главная',
    icon: HomeIcon,
  },
  {
    path: PATHS.TUTOR_ORDERS,
    label: 'Заказы',
    icon: OrderIcon,
  },
  {
    path: PATHS.TUTOR_SERVICES,
    label: 'Мои услуги',
    icon: ServiceIcon,
  },
  {
    path: PATHS.TUTOR_PROFILE,
    label: 'Профиль',
    icon: ProfileIcon,
  },
]

// Computed
const currentNavItems = computed(() => {
  if (appStore.isStudentFlow) return studentNavItems
  if (appStore.isTutorFlow) return tutorNavItems
  return []
})

// Methods
const navigateTo = (path: string) => {
  telegramStore.hapticFeedback('light')
  router.push(path)
}

const isActiveRoute = (path: string) => {
  return route.path === path
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
          'text-telegram-accent': isActiveRoute(item.path) && appStore.isStudentFlow,
          'text-telegram-success': isActiveRoute(item.path) && appStore.isTutorFlow,
          'text-telegram-text-secondary hover:text-telegram-text': !isActiveRoute(item.path),
        }"
      >
        <!-- Icon -->
        <div class="w-6 h-6 mb-1 transition-transform duration-200 relative">
          <component
            :is="item.icon"
            class="w-full h-full"
            :stroke-width="isActiveRoute(item.path) ? '2.5' : '2'"
          />

          <!-- Badge -->
          <div
            v-if="item.badge && item.badge > 0"
            class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold min-w-4"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </div>
        </div>

        <!-- Label -->
        <span
          class="text-xs font-medium leading-none transition-all duration-200 whitespace-nowrap"
          :class="{
            'font-semibold': isActiveRoute(item.path),
          }"
        >
          {{ item.label }}
        </span>
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
