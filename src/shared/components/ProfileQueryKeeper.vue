<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUser } from '@/shared/composables'

// Держим запрос профиля активным при авторизации, чтобы refetchInterval работал
const authStore = useAuthStore()
const { getProfile } = useUser()
const profileQuery = getProfile()
</script>

<template>
  <!-- Скрытый observer: запрос /users/me остаётся активным и обновляется по интервалу -->
  <span v-if="authStore.isAuthenticated && profileQuery.data" class="hidden" aria-hidden="true" />
</template>
