<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrder } from '@/shared/composables'
import { useTelegramStore } from '@/stores/telegram'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import DealCard from '../components/DealCard.vue'
import { DealStatus, type Deal } from '@/shared/types'

const telegramStore = useTelegramStore()
const { getDeals, acceptDeal, updateDeal, completeDeal } = useOrder()

const loading = ref(true)
const deals = ref<Deal[]>([])

const load = async () => {
  loading.value = true
  try {
    const res = await getDeals()
    deals.value = res?.items ?? []
  } catch (e) {
    console.error('Не удалось загрузить сделки:', e)
  } finally {
    loading.value = false
  }
}

const advance = async (deal: Deal) => {
  telegramStore.hapticFeedback('medium')
  try {
    if (deal.status === DealStatus.PENDING) await acceptDeal(deal.id)
    else if (deal.status === DealStatus.ACCEPTED)
      await updateDeal(deal.id, { status: DealStatus.IN_PROGRESS })
    else if (deal.status === DealStatus.IN_PROGRESS) await completeDeal(deal.id)
    await load()
  } catch (e) {
    console.error('Не удалось обновить сделку:', e)
    telegramStore.showAlert('Не удалось обновить сделку')
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Сделки" sub="Ваши активные занятия" />

    <div class="flex-1 overflow-y-auto px-[18px] pb-[18px]">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <span class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin" />
      </div>

      <template v-else>
        <DealCard v-for="d in deals" :key="d.id" :deal="d" @advance="advance" />
        <p v-if="!deals.length" class="text-center text-d-text-hint text-subhead py-10">
          Пока нет сделок
        </p>
      </template>
    </div>
  </div>
</template>
