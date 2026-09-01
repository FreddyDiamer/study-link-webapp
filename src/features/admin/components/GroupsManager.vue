<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Card, Button, Input, Modal } from '@components/ui'
import { GroupIcon, PlusIcon, TrashIcon } from '@components/icons'
import { useTelegramStore } from '@/stores'
import { educationApi } from '@/services/api'
import type { Group } from '@/shared/types'

const telegramStore = useTelegramStore()

const groups = ref<Group[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const newGroupNumber = ref('')
const creating = ref(false)

// Загружаем группы
const loadGroups = async () => {
  loading.value = true
  try {
    groups.value = await educationApi.getGroups()
  } catch (error) {
    console.error('Ошибка загрузки групп:', error)
    telegramStore.showAlert('Ошибка при загрузке групп')
  } finally {
    loading.value = false
  }
}

// Создаем новую группу
const createGroup = async () => {
  if (!newGroupNumber.value.trim()) return

  creating.value = true
  try {
    const newGroup = await educationApi.createGroup({
      number: newGroupNumber.value.trim(),
    })

    groups.value.push(newGroup)
    groups.value.sort((a, b) => a.number.localeCompare(b.number))

    telegramStore.showAlert('Группа успешно создана!')
    showCreateModal.value = false
    newGroupNumber.value = ''
  } catch (error) {
    console.error('Ошибка создания группы:', error)
    telegramStore.showAlert('Ошибка при создании группы')
  } finally {
    creating.value = false
  }
}

// Удаляем группу
const deleteGroup = async (group: Group) => {
  try {
    await educationApi.deleteGroup(group.id)

    const index = groups.value.findIndex((g) => g.id === group.id)
    if (index > -1) {
      groups.value.splice(index, 1)
    }

    telegramStore.showAlert('Группа удалена!')
  } catch (error) {
    console.error('Ошибка удаления группы:', error)
    telegramStore.showAlert('Ошибка при удалении группы')
  }
}

// Подтверждение удаления
const confirmDelete = (group: Group) => {
  telegramStore.showConfirm(`Удалить группу ${group.number}?`).then((confirmed) => {
    if (confirmed) {
      deleteGroup(group)
    }
  })
}

onMounted(() => {
  loadGroups()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-telegram-text">Управление группами</h2>
        <p class="text-telegram-text-secondary">Создание и удаление групп студентов</p>
      </div>

      <Button @click="showCreateModal = true" size="sm">
        <PlusIcon class="w-4 h-4 mr-2" />
        Добавить группу
      </Button>
    </div>

    <!-- Список групп -->
    <div class="grid gap-4">
      <Card v-if="loading" class="p-6">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-accent"></div>
          <span class="ml-3 text-telegram-text-secondary">Загрузка групп...</span>
        </div>
      </Card>

      <Card v-else-if="groups.length === 0" class="p-6">
        <div class="text-center text-telegram-text-secondary">
          <GroupIcon class="w-12 h-12 mx-auto mb-4 text-telegram-text-secondary/50" />
          <p>Группы не найдены</p>
          <p class="text-sm">Создайте первую группу</p>
        </div>
      </Card>

      <Card v-else v-for="group in groups" :key="group.id" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-telegram-accent/10 rounded-full flex items-center justify-center"
            >
              <GroupIcon class="w-5 h-5 text-telegram-accent" />
            </div>
            <div>
              <h3 class="font-semibold text-telegram-text">{{ group.number }}</h3>
              <p class="text-sm text-telegram-text-secondary">
                Создана {{ new Date(group.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <Button @click="confirmDelete(group)" variant="danger" size="sm">
            <TrashIcon class="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>

    <!-- Модальное окно создания -->
    <Modal v-model="showCreateModal" title="Создать новую группу">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2"> Номер группы </label>
          <Input v-model="newGroupNumber" placeholder="4212, 6105..." :disabled="creating" />
        </div>

        <div class="flex space-x-3">
          <Button
            @click="createGroup"
            :disabled="!newGroupNumber.trim() || creating"
            :loading="creating"
            class="flex-1"
          >
            Создать
          </Button>
          <Button @click="showCreateModal = false" variant="secondary" :disabled="creating">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
