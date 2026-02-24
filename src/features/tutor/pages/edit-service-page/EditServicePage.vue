<script setup lang="ts">
import { Card, Button, Input, Select, Modal } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { useEditService } from './hooks'

const {
  form,
  subjectOptions,
  teacherOptions,
  deadlines,
  educationLoading,
  educationError,
  initialize,
  isSubmitting,
  isLoading,
  showDeleteModal,
  service,
  goBack,
  updateServiceData,
  toggleFreeze,
  deleteServiceData,
  validateForm,
} = useEditService()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Button variant="ghost" @click="goBack" class="p-1 -ml-1">
            <ArrowIcon direction="left" class="size-5" />
          </Button>
          <h1 class="text-lg font-semibold text-telegram-text">Настройка услуги</h1>
        </div>
        <div v-if="!isLoading">
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              service?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
            ]"
          >
            {{ service?.status === 'ACTIVE' ? 'Активна' : 'Заморожена' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin w-8 h-8 border-4 border-telegram-accent border-t-transparent rounded-full"
      ></div>
    </div>

    <div v-else-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button
        @click="initialize"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>

    <div v-else>
      <Card class="mx-4 mt-4 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-telegram-text">Управление услугой</h3>
            <p class="text-sm text-telegram-textSecondary mt-1">
              Измените статус или настройки услуги
            </p>
          </div>
          <Button
            variant="ghost"
            @click="toggleFreeze"
            :disabled="isSubmitting"
            :class="[
              'text-sm px-4 py-2 rounded-lg transition-all',
              service?.status === 'ACTIVE'
                ? 'text-orange-600 hover:bg-orange-50 border border-orange-200'
                : 'text-green-600 hover:bg-green-50 border border-green-200',
            ]"
          >
            <svg
              v-if="service?.status === 'ACTIVE'"
              class="w-4 h-4 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ service?.status === 'ACTIVE' ? 'Заморозить' : 'Активировать' }}
          </Button>
        </div>
      </Card>

      <div class="p-4 flex flex-col gap-6">
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет преподавания</h2>
          <Select
            v-model:value="form.subject"
            :options="subjectOptions"
            placeholder="Выберите предмет"
            required
          />
        </Card>

        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">
            Выберите преподавателя, по программе которого ведете занятия
          </p>
          <Select
            v-model:value="form.teacher"
            :options="teacherOptions"
            placeholder="Выберите преподавателя"
            required
          />
        </Card>

        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Подробное описание</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">
            Расскажите о своих методах, подходе к обучению, успехах учеников
          </p>
          <textarea
            v-model="form.description"
            placeholder="Например: Индивидуальный подход к каждому ученику. Использую современные методики преподавания. "
            class="w-full h-40 input"
          />
        </Card>

        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Срок выполнения</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">
            Укажите, когда нужно выполнить задание
          </p>
          <Select
            v-model:value="form.deadline"
            :options="deadlines"
            placeholder="Выберите срок"
            required
            class="mb-4"
          />
          <Input v-if="form.deadline === 'custom'" v-model="form.customDate" type="date" />
        </Card>

        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Стоимость за занятие</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">Укажите стоимость одного занятия</p>
          <div class="flex items-center space-x-3">
            <Input v-model="form.price" placeholder="1500" type="number" class="flex-1" />
            <span class="text-telegram-textSecondary font-medium">₽</span>
          </div>
        </Card>

        <Button
          @click="updateServiceData"
          :disabled="!validateForm()"
          :loading="isSubmitting"
          size="lg"
          class="w-full"
        >
          Сохранить изменения
        </Button>

        <Button
          @click="showDeleteModal = true"
          variant="ghost"
          class="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Удалить услугу
        </Button>
      </div>
    </div>

    <Modal v-model="showDeleteModal" title="Удалить услугу">
      <div class="text-center py-4">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-telegram-text mb-2">Удалить услугу?</h3>
        <p class="text-telegram-textSecondary text-sm mb-6">
          Это действие нельзя отменить. Услуга будет удалена навсегда.
        </p>
        <div class="flex space-x-3">
          <Button variant="ghost" @click="showDeleteModal = false" class="flex-1">Отмена</Button>
          <Button @click="deleteServiceData" class="flex-1 bg-red-600 hover:bg-red-700 text-white">
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
