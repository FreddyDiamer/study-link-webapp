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
      <div
        class="w-20 h-20 bg-gradient-to-br from-telegram-accent/20 to-telegram-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center"
      >
        <svg
          class="w-10 h-10 text-telegram-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z"
          />
        </svg>
      </div>

      

      <h3 class="text-telegram-text font-semibold mb-2">Услуги не найдены</h3>
      <p class="text-telegram-textSecondary mb-0">Попробуйте изменить параметры поиска</p>
      <div
        class="inline-flex items-center gap-2 px-5 mt-4 py-2.5 rounded-full bg-telegram-accent/10 border border-telegram-accent/40 shadow-sm mx-auto mb-6 cursor-pointer hover:bg-telegram-accent/20 hover:border-telegram-accent/70 transition-all duration-200 backdrop-blur-sm"
        @click="resetFilters"
      >
        <div
          class="w-7 h-7 rounded-full bg-telegram-accent flex items-center justify-center text-white shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m0 0A8.001 8.001 0 0112 4a8 8 0 017.418 5M4.582 9H9m11 11v-5h-.581m0 0A8.003 8.003 0 0112 20a8.003 8.003 0 01-7.418-5M19.418 15H15"
            />
          </svg>
        </div>
        <div class="text-left">
          <div class="text-sm font-semibold text-telegram-accent">Сбросить фильтры</div>
        </div>
      </div>
    </div>
    <RequestModal
      v-model="showRequestModal"
      :service="selectedService"
      @submit="handleRequestSubmit"
    />
  </div>
</template>
