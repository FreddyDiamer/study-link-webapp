<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Button, Input } from '@/shared/components/ui'
import { authService } from '@/services/business'
import { useAuthStore } from '@/stores'

// Проверяем, включена ли панель разработчика через env переменную
const isDevPanelEnabled = import.meta.env.VITE_ENABLE_DEV_PANEL === 'true'

const authStore = useAuthStore()

// Состояние панели
const isOpen = ref(false)
const isDragging = ref(false)
const position = ref({ x: 20, y: 20 })
const dragOffset = ref({ x: 0, y: 0 })

// Состояние для логина
const customInitData = ref('')
const isLoading = ref(false)

// Предустановленные аккаунты
const presetAccounts = [
  {
    id: 'student1',
    name: 'Студент 1',
    initData: 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Иван%22%2C%22last_name%22%3A%22Иванов%22%2C%22username%22%3A%22student1%22%7D&auth_date=1737417600&hash=mock_hash_student1',
  },
  {
    id: 'student2',
    name: 'Студент 2',
    initData: 'user=%7B%22id%22%3A987654321%2C%22first_name%22%3A%22Мария%22%2C%22last_name%22%3A%22Петрова%22%2C%22username%22%3A%22student2%22%7D&auth_date=1737417600&hash=mock_hash_student2',
  },
  {
    id: 'tutor1',
    name: 'Репетитор 1',
    initData: 'user=%7B%22id%22%3A555555555%2C%22first_name%22%3A%22Алексей%22%2C%22last_name%22%3A%22Смирнов%22%2C%22username%22%3A%22tutor1%22%7D&auth_date=1737417600&hash=mock_hash_tutor1',
  },
  {
    id: 'tutor2',
    name: 'Репетитор 2',
    initData: 'user=%7B%22id%22%3A111111111%2C%22first_name%22%3A%22Елена%22%2C%22last_name%22%3A%22Козлова%22%2C%22username%22%3A%22tutor2%22%7D&auth_date=1737417600&hash=mock_hash_tutor2',
  },
]

// Обработчики drag-and-drop
const handleMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.dev-panel-header')) {
    isDragging.value = true
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffset.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    e.preventDefault()
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y,
    }
    // Ограничиваем перемещение в пределах экрана
    const maxX = window.innerWidth - 320 // ширина панели примерно 320px
    const maxY = window.innerHeight - 400 // высота панели примерно 400px
    position.value.x = Math.max(0, Math.min(position.value.x, maxX))
    position.value.y = Math.max(0, Math.min(position.value.y, maxY))
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Логин с предустановленным аккаунтом
const loginWithPreset = async (initData: string) => {
  isLoading.value = true
  try {
    await authService.loginWithTelegram(initData)
    // Данные обновятся реактивно через store
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

// Логин с кастомной initData
const loginWithCustom = async () => {
  if (!customInitData.value.trim()) {
    return
  }
  isLoading.value = true
  try {
    await authService.loginWithTelegram(customInitData.value.trim())
    customInitData.value = ''
    // Данные обновятся реактивно через store
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

// Текущий пользователь
const currentUser = computed(() => authStore.user)

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div
    v-if="isOpen && isDevPanelEnabled"
    class="dev-panel fixed z-[9999] bg-telegram-card border border-telegram-border rounded-lg shadow-2xl"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '320px',
      maxHeight: '80vh',
      cursor: isDragging ? 'grabbing' : 'default',
    }"
    @mousedown="handleMouseDown"
  >
    <!-- Заголовок панели -->
    <div
      class="dev-panel-header flex items-center justify-between p-3 border-b border-telegram-border cursor-grab active:cursor-grabbing bg-telegram-secondary rounded-t-lg"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-telegram-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-sm font-semibold text-telegram-text">Dev Panel</h3>
      </div>
      <button
        @click="isOpen = false"
        class="p-1 hover:bg-telegram-card rounded transition-colors"
        title="Закрыть"
      >
        <svg class="w-4 h-4 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Содержимое панели -->
    <div class="p-4 overflow-y-auto" style="max-height: calc(80vh - 50px)">
      <!-- Текущий пользователь -->
      <div v-if="currentUser" class="mb-4 p-3 bg-telegram-secondary rounded-lg">
        <p class="text-xs text-telegram-textSecondary mb-1">Текущий пользователь:</p>
        <p class="text-sm font-medium text-telegram-text">{{ currentUser.name }}</p>
        <p class="text-xs text-telegram-textSecondary">@{{ currentUser.telegramUsername }}</p>
      </div>

      <!-- Предустановленные аккаунты -->
      <div class="mb-4">
        <h4 class="text-xs font-semibold text-telegram-textSecondary mb-2 uppercase">Быстрый вход</h4>
        <div class="space-y-2">
          <Button
            v-for="account in presetAccounts"
            :key="account.id"
            @click="loginWithPreset(account.initData)"
            :disabled="isLoading"
            variant="secondary"
            size="sm"
            class="w-full justify-start text-left"
          >
            <span class="flex-1">{{ account.name }}</span>
          </Button>
        </div>
      </div>

      <!-- Кастомный вход -->
      <div>
        <h4 class="text-xs font-semibold text-telegram-textSecondary mb-2 uppercase">Кастомный вход</h4>
        <div class="space-y-2">
          <Input
            v-model="customInitData"
            placeholder="Введите initData строку..."
            type="text"
            @keyup.enter="loginWithCustom"
          />
          <Button
            @click="loginWithCustom"
            :disabled="!customInitData.trim() || isLoading"
            variant="primary"
            size="sm"
            :loading="isLoading"
            class="w-full"
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Кнопка открытия панели -->
  <button
    v-if="!isOpen && isDevPanelEnabled"
    @click="isOpen = true"
    class="fixed bottom-4 right-4 z-[9999] w-12 h-12 bg-telegram-accent text-white rounded-full shadow-lg hover:bg-telegram-accent/90 transition-all flex items-center justify-center"
    title="Открыть Dev Panel"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>
</template>

<style scoped>
.dev-panel {
  user-select: none;
}

.dev-panel-header {
  user-select: none;
}
</style>
