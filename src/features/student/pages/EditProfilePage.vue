<script setup lang="ts">
import { ref, reactive } from 'vue'
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

const form = reactive({
  firstName: telegramStore.firstName || '',
  lastName: telegramStore.lastName || '',
})

const isLoading = ref(false)

const handleSave = async () => {
  isLoading.value = true

  try {
    const updateData: Partial<User> = {
      name: `${form.firstName} ${form.lastName}`.trim(),
    }

    await userService.updateProfile(updateData)

    console.log('Профиль сохранен:', form)

    // Возвращаемся на предыдущую страницу
    router.back()
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <Button variant="ghost" @click="handleBack" class="!p-2">
        <ArrowIcon class="w-5 h-5 rotate-180" />
      </Button>

      <h1 class="text-lg font-semibold text-telegram-text">Редактировать профиль</h1>

      <div class="w-9"></div>
    </div>

    <!-- Profile Form -->
    <Card class="p-6 mb-6">
      <form @submit.prevent="handleSave" class="space-y-6">
        <!-- Avatar Section -->
        <div class="flex items-center space-x-4 mb-6">
          <div
            class="w-16 h-16 shrink-0 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold"
          >
            {{ form.firstName?.charAt(0) || 'С' }}
          </div>
          <div>
            <h3 class="text-lg font-medium text-telegram-text">Фото профиля</h3>
            <p class="text-sm text-telegram-textSecondary">
              Аватар генерируется автоматически на основе имени
            </p>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <Input v-model="form.firstName" label="Имя" placeholder="Введите ваше имя" required />

          <Input
            v-model="form.lastName"
            label="Фамилия"
            placeholder="Введите вашу фамилию (необязательно)"
          />
        </div>
      </form>
    </Card>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <Button @click="handleSave" :loading="isLoading" class="w-full"> Сохранить изменения </Button>

      <Button variant="ghost" @click="handleBack" class="w-full" :disabled="isLoading">
        Отменить
      </Button>
    </div>
  </div>
</template>
