<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { authService } from '@/services/business'
import type { DevLoginTarget, DevUser } from '@/services/api/auth'
import { ActionButton, LoadError } from '@/shared/components/ui'
import UsernameField from './UsernameField.vue'
import DevUserList from './DevUserList.vue'

/** Что сейчас входит: поле, быстрый вход или конкретная строка списка (её id). */
type Pending = 'username' | 'default' | { userId: string }

const users = ref<DevUser[]>([])
const loadingUsers = ref(true)
const usersFailed = ref(false)
const username = ref('')
const usernameError = ref('')
// сбой быстрого входа или входа из списка — у поля свой текст ошибки
const error = ref('')
const pending = ref<Pending | null>(null)

const busy = computed(() => pending.value !== null)
const pendingUserId = computed(() =>
  pending.value && typeof pending.value === 'object' ? pending.value.userId : null,
)

// поле работает и как поиск: пока печатаешь, список сужается до похожих
const visibleUsers = computed(() => {
  const q = username.value.toLowerCase()
  if (!q) return users.value
  return users.value.filter(
    (u) => u.telegramUsername?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q),
  )
})

// ошибка относится к введённому: исправил username — она больше не правда
watch(username, () => {
  usernameError.value = ''
})

const loadUsers = async () => {
  loadingUsers.value = true
  usersFailed.value = false
  try {
    users.value = (await authService.getDevUsers()) ?? []
  } catch (e) {
    console.error('Не удалось получить список dev-пользователей:', e)
    usersFailed.value = true
  } finally {
    loadingUsers.value = false
  }
}

const login = async (target: DevLoginTarget | undefined, by: Pending) => {
  if (busy.value) return
  pending.value = by
  error.value = ''
  usernameError.value = ''
  try {
    // успешный вход сам убирает этот экран: App.vue следит за авторизацией
    await authService.devLogin(target)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не удалось войти'
    if (by === 'username') usernameError.value = message
    else error.value = message
    pending.value = null
  }
}

const handleUsernameSubmit = () => login({ telegramUsername: username.value }, 'username')
const handleQuickLogin = () => login(undefined, 'default')
const handlePick = (userId: string) => login({ userId }, { userId })

onMounted(loadUsers)
</script>

<template>
  <div class="h-full overflow-y-auto px-[18px] py-10">
    <div class="max-w-sm mx-auto">
      <div class="flex items-center gap-2.5 mb-2">
        <span
          class="w-8 h-8 rounded-chip bg-d-accent flex items-center justify-center shadow-d-logo"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" fill="#0E0F13" />
            <path
              d="M6.5 11.2V15c0 1 2.5 2.2 5.5 2.2s5.5-1.2 5.5-2.2v-3.8"
              stroke="#0E0F13"
              stroke-width="1.6"
            />
          </svg>
        </span>
        <h1 class="text-title-m">Study Link</h1>
        <span class="ml-auto text-micro uppercase text-d-text-hint">dev</span>
      </div>
      <p class="text-subhead text-d-text-second mb-7">
        Веб-вход работает только в дев-окружении. Введите username из Telegram или выберите
        пользователя ниже.
      </p>

      <UsernameField
        v-model="username"
        :loading="pending === 'username'"
        :disabled="busy"
        :error="usernameError"
        class="mb-3"
        @submit="handleUsernameSubmit"
      />

      <ActionButton
        variant="secondary"
        :loading="pending === 'default'"
        :disabled="busy"
        @click="handleQuickLogin"
      >
        Быстрый вход · dev_user
      </ActionButton>

      <p v-if="error" role="alert" class="text-caption text-d-coral mt-2">{{ error }}</p>

      <!-- без списка вход не ломается: username по-прежнему работает -->
      <LoadError
        v-if="usersFailed"
        compact
        class="mt-7"
        title="Список пользователей не загрузился"
        text="Войти по username можно и без него."
        :loading="loadingUsers"
        @retry="loadUsers"
      />
      <DevUserList
        v-else
        class="mt-7"
        :users="visibleUsers"
        :total="users.length"
        :query="username"
        :loading="loadingUsers"
        :disabled="busy"
        :pending-id="pendingUserId"
        @pick="handlePick"
      />
    </div>
  </div>
</template>
