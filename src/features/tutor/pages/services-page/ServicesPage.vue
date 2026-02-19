<script setup lang="ts">
import {
  ServicesTabs,
  ServiceCard,
  CreateServiceCard,
  ServicesEmptyState,
  ResponseCard,
  ResponsesEmptyState,
  DealCard,
  DealsEmptyState,
} from './ui'
import { useTutorServicesPage } from './hooks'

const {
  activeTab,
  activeServices,
  requestResponses,
  activeDeals,
  createService,
  viewService,
  editService,
  viewDealDetails,
  completeDeal,
  withdrawResponse,
  switchTab,
} = useTutorServicesPage()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-telegram-text mb-2">Управление услугами</h1>
        <p class="text-telegram-textSecondary">Услуги, отклики и активные занятия</p>
      </div>
    </div>

    <ServicesTabs :active-tab="activeTab" @update:active-tab="switchTab" />

    <!-- Services Tab -->
    <div v-if="activeTab === 'services'">
      <ServicesEmptyState v-if="activeServices.length === 0" @create="createService" />
      <div v-else class="space-y-4">
        <CreateServiceCard @click="createService" />
        <ServiceCard
          v-for="service in activeServices"
          :key="service.id"
          :service="service"
          @view="viewService"
          @edit="editService"
        />
      </div>
    </div>

    <!-- Responses Tab -->
    <div v-if="activeTab === 'responses'">
      <div v-if="requestResponses.length > 0" class="space-y-4">
        <ResponseCard
          v-for="response in requestResponses"
          :key="response.id"
          :response="response"
          @withdraw="withdrawResponse"
        />
      </div>
      <ResponsesEmptyState v-else />
    </div>

    <!-- Deals Tab -->
    <div v-if="activeTab === 'deals'">
      <div v-if="activeDeals.length > 0" class="space-y-4">
        <DealCard
          v-for="deal in activeDeals"
          :key="deal.id"
          :deal="deal"
          @view="viewDealDetails"
          @complete="completeDeal"
        />
      </div>
      <DealsEmptyState v-else />
    </div>
  </div>
</template>
