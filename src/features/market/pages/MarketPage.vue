<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useService } from '@/shared/composables'
import { orderService } from '@/services/business'
import { useTelegramStore } from '@/stores/telegram'
import { serviceDetailPath, PATHS } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import MarketSegment, { type MarketSeg } from '../components/MarketSegment.vue'
import ServiceCard from '../components/ServiceCard.vue'
import RequestCard from '../components/RequestCard.vue'
import CardSkeleton from '../components/CardSkeleton.vue'
import type { Service, Request } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()
const { getActiveServices } = useService()

const segment = ref<MarketSeg>('services')
const loading = ref(true)
const services = ref<Service[]>([])
const requests = ref<Request[]>([])

const load = async () => {
  loading.value = true
  try {
    const [svc, req] = await Promise.all([getActiveServices(), orderService.getRequests()])
    services.value = svc?.items ?? []
    requests.value = req?.items ?? []
  } catch (e) {
    console.error('Не удалось загрузить маркет:', e)
  } finally {
    loading.value = false
  }
}

const openService = (id: string) => {
  telegramStore.hapticFeedback('light')
  router.push(serviceDetailPath(id))
}

const goCreate = () => router.push(PATHS.SERVICE_CREATE)

const delay = (i: number) => `${i * 0.07}s`

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Маркет" sub="Найдите репетитора" add reload @add="goCreate" @reload="load" />
    <div class="shrink-0 px-[18px] pt-3.5 pb-3">
      <MarketSegment v-model="segment" />
    </div>

    <div class="flex-1 overflow-y-auto px-[18px] pb-[18px] flex flex-col gap-3">
      <template v-if="loading">
        <CardSkeleton v-for="n in 4" :key="n" />
      </template>

      <template v-else-if="segment === 'services'">
        <ServiceCard
          v-for="(s, i) in services"
          :key="s.id"
          :service="s"
          :delay="delay(i)"
          @click="openService(s.id)"
        />
        <p v-if="!services.length" class="text-center text-d-text-hint text-subhead py-10">
          Пока нет услуг
        </p>
      </template>

      <template v-else>
        <RequestCard v-for="(q, i) in requests" :key="q.id" :request="q" :delay="delay(i)" />
        <p v-if="!requests.length" class="text-center text-d-text-hint text-subhead py-10">
          Пока нет заявок
        </p>
      </template>
    </div>
  </div>
</template>
