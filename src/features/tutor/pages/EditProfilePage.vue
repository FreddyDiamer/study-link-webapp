<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { ArrowIcon } from '@/shared/components/icons'
import type { User } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)

const form = reactive({
  name: '',
  description: '',
})

const loadProfile = async () => {
  isLoading.value = true
  try {
    user.value = await userService.getProfile()
    // Заполняем форму данными пользователя
    form.name = user.value.name || ''
    form.description = user.value.description || ''
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true

  try {
    const updateData: Partial<User> = {}

    if (form.name.trim()) {
      updateData.name = form.name.trim()
    }

    if (form.description.trim()) {
      updateData.description = form.description.trim()
    }

    await userService.updateProfile(updateData)

    // Возвращаемся на предыдущую страницу
    router.back()
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error)
  } finally {
    isSaving.value = false
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <Button variant="ghost" @click="handleBack" class="p-2!">
        <ArrowIcon class="w-5 h-5 rotate-180" />
      </Button>

      <h1 class="text-lg font-semibold text-telegram-text">Редактировать профиль</h1>

      <div class="w-9"></div>
    </div>

    <!-- Profile Form -->
    <Card class="p-6 mb-6">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
      </div>

      <form v-else @submit.prevent="handleSave" class="space-y-6">
        <!-- Avatar Section -->
        <div class="flex items-center space-x-4 mb-6">
          <div
            class="w-16 h-16 bg-telegram-success rounded-full flex items-center justify-center text-white text-xl font-bold"
          >
            {{ form.name?.charAt(0) || user?.name?.charAt(0) || 'Р' }}
          </div>
          <div>
            <h3 class="text-lg font-medium text-telegram-text">Фото профиля</h3>
            <p class="text-sm text-telegram-text-secondary">
              Аватар генерируется автоматически на основе имени
            </p>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <Input v-model="form.name" label="Имя" placeholder="Введите ваше имя" required />

          <div class="space-y-2">
            <label class="block text-sm font-medium text-telegram-text"> Описание </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Расскажите о себе, своем опыте преподавания, достижениях..."
              class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-text-secondary focus:outline-hidden focus:border-telegram-accent transition-colors resize-none"
            />
            <p class="text-xs text-telegram-text-secondary">
              Это описание поможет студентам лучше узнать вас
            </p>
          </div>
        </div>
      </form>
    </Card>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <Button @click="handleSave" :loading="isSaving" class="w-full" :disabled="isLoading">
        Сохранить изменения
      </Button>

      <Button variant="ghost" @click="handleBack" class="w-full" :disabled="isLoading || isSaving">
        Отменить
      </Button>
    </div>
  </div>
</template>
