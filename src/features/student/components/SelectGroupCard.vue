<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Card, Select, Button, type SelectOption } from '@components/ui'
import { GroupIcon, InfoIcon, ServiceIcon } from '@components/icons'
import { useTelegramStore, useAuthStore, useAppStore } from '@/stores'
import { usersApi, educationApi } from '@/services/api'
import type { Group } from '@/shared/types'

const telegramStore = useTelegramStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const group = ref<SelectOption | null>(null)
const loading = ref(false)
const groups = ref<Group[]>([])
const loadingGroups = ref(false)

// Загружаем список групп
const loadGroups = async () => {
  loadingGroups.value = true
  try {
    groups.value = await educationApi.getGroups()
  } catch (error) {
    console.error('Ошибка загрузки групп:', error)
    telegramStore.showAlert('Ошибка при загрузке групп')
  } finally {
    loadingGroups.value = false
  }
}

// Инициализируем группу из профиля пользователя
onMounted(async () => {
  await loadGroups()

  if (authStore.user?.groupId) {
    // Если у пользователя уже есть группа, устанавливаем её в селект
    group.value = {
      label: authStore.user.group?.number || '',
      value: authStore.user.group?.id || '',
    }
  }
})

const saveGroupNumber = async () => {
  loading.value = true

  try {
    telegramStore.hapticFeedback('medium')

    // Если группа не выбрана, передаем undefined для удаления группы
    const groupId = group.value?.value

    if (!groupId) {
      console.error('Группа не выбрана')
      return
    }

    // Обновляем группу пользователя через API
    const updatedUser = await usersApi.updateGroup(groupId)

    // Обновляем данные в store
    authStore.setUser(updatedUser)

    telegramStore.showAlert('Группа успешно сохранена!')

    // Скрыть карточку после сохранения
    hideGroupCard()
  } catch (error) {
    console.error('Ошибка сохранения группы:', error)
    telegramStore.showAlert('Ошибка при сохранении группы. Попробуйте еще раз.')
  } finally {
    loading.value = false
  }
}

const hideGroupCard = () => {
  appStore.showGroupCard = false
}
</script>

<template>
  <Card class="p-5 border-l-4 border-l-telegram-accent">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-telegram-accent/10 rounded-full flex items-center justify-center shrink-0"
        >
          <ServiceIcon class="w-5 h-5 text-telegram-accent" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-telegram-text">Укажите вашу группу</h3>
          <p class="text-sm text-telegram-text-secondary">
            Мы подберем репетиторов по вашим предметам
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-telegram-secondary/50 p-3 rounded-lg">
        <div class="flex items-start space-x-2">
          <InfoIcon class="w-4 h-4 text-telegram-accent mt-0.5 shrink-0" />
          <p class="text-xs text-telegram-text-secondary leading-relaxed">
            Введите номер группы, и мы автоматически определим ваши предметы, чтобы предложить
            подходящие услуги и репетиторов
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <Select
          v-model="group"
          :options="[
            ...groups.map((group) => ({
              label: group.number,
              value: group.id,
            })),
          ]"
          placeholder="Выберите группу..."
          :loading="loadingGroups"
          class="w-full"
        >
          <template #prepend>
            <GroupIcon class="w-4 h-4 text-telegram-text-secondary" />
          </template>
        </Select>

        <div class="space-y-3">
          <Button
            @click="saveGroupNumber"
            :disabled="!group?.value"
            :loading="loading"
            class="w-full"
            size="sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Сохранить группу
          </Button>

          <button
            @click="hideGroupCard"
            class="text-xs text-telegram-text-secondary hover:text-telegram-text transition-colors mx-auto block"
          >
            Больше не показывать
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>
