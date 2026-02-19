<script setup lang="ts">
import { Button, Card, Input } from '@/shared/components/ui'
import {
  OrderCard,
  FiltersPanel,
  OrdersEmptyState,
  AcceptResponseModal,
} from './ui'
import { useTutorOrders } from './hooks'

const {
  isLoading,
  error,
  showFilters,
  showAcceptModal,
  selectedRequest,
  isAccepting,
  tutorComment,
  proposedDate,
  proposedPrice,
  filters,
  availableSubjects,
  availableTeachers,
  sortOptions,
  sortOrderOptions,
  filteredOrders,
  pageTitle,
  resultStats,
  isOwnOrder,
  loadOrders,
  resetFilters,
  toggleFilters,
  goBack,
  respondToOrder,
  handleAcceptDeal,
  handleCloseAcceptModal,
  setTutorComment,
  setProposedDate,
  setProposedPrice,
} = useTutorOrders()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3 p-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div>
          <h1 class="text-xl font-semibold text-telegram-text">{{ pageTitle }}</h1>
          <p class="text-telegram-textSecondary text-sm">{{ resultStats.total }} заказов найдено</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" @click="toggleFilters" class="p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </Button>
    </div>

    <Card class="p-4 mb-4">
      <Input
        v-model="filters.search"
        placeholder="Поиск заказов по предметам, студентам, описанию..."
        class="w-full"
      >
        <template #prepend>
          <svg
            class="w-4 h-4 text-telegram-textSecondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </template>
      </Input>
    </Card>

    <div v-if="showFilters" class="mb-6">
      <FiltersPanel
        :filters="filters"
        :available-subjects="availableSubjects"
        :available-teachers="availableTeachers"
        :sort-options="sortOptions"
        :sort-order-options="sortOrderOptions"
        @reset="resetFilters"
      />
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-accent"
      ></div>
      <p class="text-telegram-textSecondary mt-2">Загрузка заказов...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">{{ error }}</div>
      <Button @click="loadOrders" size="sm">Попробовать снова</Button>
    </div>

    <div v-else-if="filteredOrders.length > 0" class="space-y-4">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        :is-own-order="isOwnOrder(order)"
        @respond="respondToOrder"
      />
    </div>

    <OrdersEmptyState v-else @reset-filters="resetFilters" />

    <AcceptResponseModal
      v-model="showAcceptModal"
      :selected-request="selectedRequest"
      :tutor-comment="tutorComment"
      :proposed-date="proposedDate"
      :proposed-price="proposedPrice"
      :is-accepting="isAccepting"
      @update:tutor-comment="setTutorComment"
      @update:proposed-date="setProposedDate"
      @update:proposed-price="setProposedPrice"
      @submit="handleAcceptDeal"
      @close="handleCloseAcceptModal"
    />
  </div>
</template>
