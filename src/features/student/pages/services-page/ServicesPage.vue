<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { ArrowIcon, FilterIcon, LoupeIcon } from '@/shared/components/icons'
import { Select } from '@/shared/components/ui'
import { ServiceCard, RequestModal } from './ui'
import { useServicesPage } from './hooks'
import { SORT_OPTIONS, SORT_ORDER_OPTIONS } from './models'

const {
  filters,
  isLoading,
  error,
  filteredServices,
  pageTitle,
  resultStats,
  showFilters,
  showRequestModal,
  selectedService,
  availableSubjects,
  availableTeachers,
  loadServices,
  resetFilters,
  toggleFilters,
  goBack,
  submitRequest,
  handleRequestSubmit,
  viewServiceDetails,
} = useServicesPage()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3 p-2">
          <ArrowIcon direction="left" />
        </Button>
        <div>
          <h1 class="text-xl font-semibold text-telegram-text">{{ pageTitle }}</h1>
          <p class="text-telegram-textSecondary text-sm">{{ resultStats.total }} услуг найдено</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" @click="toggleFilters" class="p-2">
        <FilterIcon />
      </Button>
    </div>
    <Card class="p-4 mb-4">
      <Input v-model="filters.search" placeholder="Поиск услуг, предметов, преподавателей..." class="w-full">
        <template #prepend><LoupeIcon /></template>
      </Input>
    </Card>
    <div v-if="showFilters" class="mb-6">
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-telegram-text text-lg">Фильтры</h3>
          <Button variant="ghost" size="sm" @click="resetFilters">Сбросить</Button>
        </div>
        <div class="space-y-4">
          <div>
            <Select
              v-model:value="filters.subject"
              :options="availableSubjects"
              placeholder="Выберите предмет"
            />
          </div>
          <div>
            <Select
              v-model:value="filters.teacher"
              :options="availableTeachers"
              placeholder="Выберите преподавателя"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <Select v-model:value="filters.sortBy" :options="SORT_OPTIONS" placeholder="Сортировка" />
            <Select v-model:value="filters.sortOrder" :options="SORT_ORDER_OPTIONS" placeholder="Порядок" />
          </div>
        </div>
      </Card>
    </div>
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-accent"></div>
      <p class="text-telegram-textSecondary mt-2">Загрузка услуг...</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">{{ error }}</div>
      <Button @click="loadServices" size="sm">Попробовать снова</Button>
    </div>
    <div v-else-if="filteredServices.length > 0" class="space-y-4">
      <ServiceCard
        v-for="service in filteredServices"
        :key="service.id"
        :service="service"
        @request="submitRequest"
        @view="viewServiceDetails"
      />
    </div>
    <div v-else class="text-center py-12">
      <h3 class="text-telegram-text font-semibold mb-2">Услуги не найдены</h3>
      <p class="text-telegram-textSecondary mb-4">Попробуйте изменить параметры поиска</p>
      <Button @click="resetFilters" variant="secondary">Сбросить фильтры</Button>
    </div>
    <RequestModal
      v-model="showRequestModal"
      :service="selectedService"
      @submit="handleRequestSubmit"
    />
  </div>
</template>
