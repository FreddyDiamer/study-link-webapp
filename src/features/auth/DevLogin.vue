<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '@/services/business'
import type { DevUser } from '@/services/api/auth'
import AvatarChip from '@/shared/components/AvatarChip.vue'

const users = ref<DevUser[]>([])
const loadingUsers = ref(true)
const busy = ref(false)
const error = ref('')

const loadUsers = async () => {
  loadingUsers.value = true
  error.value = ''
  try {
    users.value = (await authService.getDevUsers()) ?? []
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось получить список пользователей'
  } finally {
    loadingUsers.value = false
  }
}

const login = async (userId?: string) => {
  if (busy.value) return
  busy.value = true
  error.value = ''
  try {
    // успешный вход сам убирает этот экран: App.vue следит за авторизацией
    await authService.devLogin(userId)
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось войти'
    busy.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="h-full overflow-y-auto px-[18px] py-10">
    <div class="max-w-sm mx-auto">
      <div class="flex items-center gap-2.5 mb-2">
        <span
          class="w-8 h-8 rounded-chip bg-d-accent flex items-center justify-center shadow-d-logo"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" fill="#0E0F13" />
            <path
              d="M6.5 11.2V15c0 1 2.5 2.2 5.5 2.2s5.5-1.2 5.5-2.2v-3.8"
              stroke="#0E0F13"
              stroke-width="1.6"
            />
          </svg>
        </span>
        <span class="text-title-m">Study Link</span>
        <span class="ml-auto text-micro uppercase text-d-text-hint">dev</span>
      </div>
      <p class="text-subhead text-d-text-second mb-6">
        Вход через веб доступен только в дев-окружении. Выберите пользователя или войдите дефолтным.
      </p>

      <button
        class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold mb-2 disabled:opacity-40"
        :disabled="busy"
        @click="login()"
      >
        Быстрый вход (default)
      </button>

      <p v-if="error" class="text-caption text-d-coral my-2">{{ error }}</p>

      <div class="text-overline uppercase text-d-text-hint mt-6 mb-3">Существующие пользователи</div>

      <div v-if="loadingUsers" class="flex justify-center py-8">
        <span
          class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
        />
      </div>

      <div v-else class="flex flex-col gap-2">
        <button
          v-for="u in users"
          :key="u.id"
          class="press flex items-center gap-3 bg-d-panel border border-d-border rounded-card p-3 text-left hover:border-d-border-hover disabled:opacity-40"
          :disabled="busy"
          @click="login(u.id)"
        >
          <AvatarChip :name="u.name || u.telegramUsername || u.id" size="md" />
          <div class="min-w-0">
            <div class="text-subhead font-semibold truncate">{{ u.name || 'Без имени' }}</div>
            <div v-if="u.telegramUsername" class="text-caption text-d-text-hint truncate">
              @{{ u.telegramUsername }}
            </div>
          </div>
        </button>
        <p v-if="!users.length" class="text-subhead text-d-text-hint text-center py-6">
          Нет пользователей
        </p>
      </div>
    </div>
  </div>
</template>
