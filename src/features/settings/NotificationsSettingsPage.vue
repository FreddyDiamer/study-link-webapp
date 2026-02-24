<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import { Button } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { useUser } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import { useTelegramStore } from '@/stores/telegram'

const router = useRouter()
const route = useRoute()
const telegramStore = useTelegramStore()
const { getProfile, updateProfile } = useUser()
const profileQuery = getProfile()
const updateMutation = updateProfile()

const user = computed(() => profileQuery.data.value ?? null)
const isLoading = computed(() => profileQuery.isLoading.value)
const isSaving = computed(() => updateMutation.isPending.value)
const enabled = computed({
  get: () => user.value?.telegramNotificationsEnabled ?? true,
  set: () => {},
})

function handleBack() {
  const isStudent = route.path.startsWith('/student')
  router.push(isStudent ? PATHS.STUDENT_PROFILE : PATHS.TUTOR_PROFILE)
}

async function toggleNotifications() {
  const u = user.value
  if (!u || isSaving.value) return
  const next = !(u.telegramNotificationsEnabled ?? true)
  try {
    await updateMutation.mutateAsync({ telegramNotificationsEnabled: next })
    telegramStore.hapticFeedback('light')
  } catch {
    telegramStore.showAlert('Не удалось сохранить настройки')
  }
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <Button variant="ghost" @click="handleBack" class="!p-2">
        <ArrowIcon class="w-5 h-5 rotate-180" />
      </Button>
      <h1 class="text-lg font-semibold text-telegram-text">Уведомления</h1>
      <div class="w-9"></div>
    </div>

    <Card class="p-4">
      <div v-if="isLoading" class="text-center py-6 text-telegram-textSecondary">
        Загрузка...
      </div>
      <div v-else class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-telegram-secondary rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-telegram-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <p class="text-telegram-text font-medium">Уведомления в Telegram</p>
            <p class="text-telegram-textSecondary text-sm">
              Получать сообщения об откликах, сделках и отзывах
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="enabled"
          :disabled="isSaving"
          class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-telegram-accent focus:ring-offset-2 focus:ring-offset-telegram-bg disabled:opacity-50"
          :class="enabled ? 'bg-telegram-accent' : 'bg-telegram-secondary'"
          @click="toggleNotifications"
        >
          <span
            class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition"
            :class="enabled ? 'translate-x-5' : 'translate-x-1'"
          />
        </button>
      </div>
    </Card>
  </div>
</template>
