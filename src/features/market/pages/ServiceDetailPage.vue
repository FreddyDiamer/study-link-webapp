<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { useDealsBadge, useInboxBadge, useOrder, useService, useToast } from '@/shared/composables'
import { reviewService } from '@/services/business'
import { dealsPath } from '@/router/paths'
import { ROLE_META } from '@/shared/constants'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionButton, ActionsSheet, type SheetAction } from '@/shared/components/ui'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReputationHero from '../components/ReputationHero.vue'
import IncomingBookingCard from '../components/IncomingBookingCard.vue'
import { countWithWord, formatKopeks } from '@/shared/utils'
import {
  ResponseStatus,
  ServiceStatus,
  type Review,
  type Service,
  type ServiceResponse,
} from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getService, activateService, deactivateService } = useService()
const {
  createServiceResponse,
  getMyServiceResponse,
  getServiceResponses,
  acceptServiceResponse,
  rejectServiceResponse,
} = useOrder()
const { showToast } = useToast()
const { refresh: refreshDealsBadge } = useDealsBadge()
const { refresh: refreshInboxBadge } = useInboxBadge()

const id = route.params.id as string
const loading = ref(true)
const failed = ref(false)
const booking = ref(false)
const booked = ref(false)
const deciding = ref(false)
const service = ref<Service | null>(null)
const reviews = ref<Review[]>([])
const bookings = ref<ServiceResponse[]>([])
// моя запись на чужую услугу: в самой услуге бэкенд отдаёт только их число
const myBooking = ref<ServiceResponse | null>(null)
const actionsSheet = ref(false)

// роль — свойство объекта: на своей услуге вы исполнитель, на чужой — заказчик
const isMine = computed(() => service.value?.tutorId === auth.user?.id)
const isListed = computed(() => service.value?.status === ServiceStatus.ACTIVE)

const rating = computed(() => service.value?.tutor?.rating ?? 0)
const reviewsCount = computed(() => service.value?.tutor?.reviewsCount ?? reviews.value.length)

// распределение оценок (ширины полос относительно макс. корзины)
const distribution = computed<number[] | undefined>(() => {
  if (!reviews.value.length) return undefined
  const buckets = [0, 0, 0, 0, 0] // 5★..1★
  reviews.value.forEach((r) => {
    const idx = 5 - Math.round(r.rating)
    if (idx >= 0 && idx < 5) buckets[idx]++
  })
  const max = Math.max(...buckets, 1)
  return buckets.map((c) => Math.round((c / max) * 100))
})

// записаться второй раз бэкенд не даст — вместо кнопки показываем, чем кончилась запись
const bookingStatus = computed<ResponseStatus | null>(() =>
  booked.value ? ResponseStatus.PENDING : (myBooking.value?.status ?? null),
)
const bookingLabel = computed(() => {
  if (bookingStatus.value === ResponseStatus.ACCEPTED) return '✓ Вас записали'
  if (bookingStatus.value === ResponseStatus.REJECTED) return 'Репетитор отказал'
  if (bookingStatus.value === ResponseStatus.EXPIRED) return 'Запись истекла'
  return '✓ Заявка отправлена'
})
const bookingDeclined = computed(
  () =>
    bookingStatus.value === ResponseStatus.REJECTED ||
    bookingStatus.value === ResponseStatus.EXPIRED,
)

const pendingCount = computed(
  () => bookings.value.filter((b) => b.status === ResponseStatus.PENDING).length,
)

const headerSub = computed(() => {
  if (!service.value) return ''
  if (!isMine.value) return service.value.tutor?.name
  if (!isListed.value) return 'Скрыта из ленты'
  return pendingCount.value
    ? `В ленте · ${countWithWord(pendingCount.value, 'новая запись', 'новые записи', 'новых записей')}`
    : 'В ленте'
})

// все действия над своей услугой живут в одном меню
const actions = computed<SheetAction[]>(() =>
  isListed.value
    ? [{ id: 'hide', label: 'Скрыть из ленты', icon: '✕', destructive: true }]
    : [{ id: 'show', label: 'Вернуть в ленту', icon: '↻' }],
)

const load = async () => {
  loading.value = true
  failed.value = false
  try {
    const s = await getService(id)
    service.value = s
    if (s?.tutorId === auth.user?.id) {
      bookings.value = await getServiceResponses(id)
    } else if (s?.tutor?.id) {
      const [tutorReviews, mine] = await Promise.all([
        reviewService.getUserReviews(s.tutor.id),
        getMyServiceResponse(id).catch(() => null),
      ])
      reviews.value = tutorReviews
      myBooking.value = mine
    }
  } catch (e) {
    console.error('Не удалось загрузить услугу:', e)
    failed.value = true
  } finally {
    loading.value = false
  }
}

// в макете запись в одно касание: без формы, отклик уходит сразу
const book = async () => {
  if (booking.value || !auth.user?.id) return
  booking.value = true
  try {
    await createServiceResponse({ studentId: auth.user.id, serviceId: id })
    telegramStore.hapticFeedback('medium')
    booked.value = true
    showToast('Заявка репетитору отправлена')
  } catch (e) {
    console.error('Не удалось записаться:', e)
  } finally {
    booking.value = false
  }
}

// принятие записи и есть сделка: дальше — подтверждение и отзыв на экране «Сделки»
const accept = async (responseId: string) => {
  if (deciding.value) return
  deciding.value = true
  try {
    await acceptServiceResponse(responseId)
    showToast('Сделка создана')
    bookings.value = await getServiceResponses(id)
    await Promise.all([refreshDealsBadge(), refreshInboxBadge()])
  } catch (e) {
    console.error('Не удалось принять запись:', e)
  } finally {
    deciding.value = false
  }
}

const reject = async (responseId: string) => {
  if (deciding.value) return
  deciding.value = true
  try {
    await rejectServiceResponse(responseId)
    showToast('Студенту отправлен отказ')
    bookings.value = await getServiceResponses(id)
    await refreshInboxBadge()
  } catch (e) {
    console.error('Не удалось отказать:', e)
  } finally {
    deciding.value = false
  }
}

// из ответа берём только статус: PATCH отдаёт услугу без рейтинга репетитора
const applyStatus = (updated: Service) => {
  if (service.value) service.value = { ...service.value, status: updated.status }
}

const onAction = async (action: string) => {
  try {
    if (action === 'hide') {
      applyStatus(await deactivateService(id))
      showToast('Услуга скрыта из ленты')
    } else if (action === 'show') {
      applyStatus(await activateService(id))
      showToast('Услуга вернулась в ленту')
    }
  } catch (e) {
    // сбой уже показан алертом бизнес-слоя
    console.error('Не удалось изменить услугу:', e)
  }
}

// записи принимает владелец услуги — в этой сделке он исполнитель
const goDeals = () => router.push(dealsPath('worker'))

const delay = (i: number) => `${i * 0.06}s`

onMounted(load)
</script>

<template>
  <div
    class="flex flex-col h-full"
    :class="service ? ROLE_META[isMine ? 'worker' : 'customer'].scope : ''"
  >
    <AppHeader
      :title="isMine ? 'Моя услуга' : 'Услуга'"
      :role="service ? (isMine ? 'worker' : 'customer') : undefined"
      :sub="headerSub"
      back
      :menu="isMine"
      @menu="actionsSheet = true"
    />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <div
      v-else-if="failed || !service"
      class="flex-1 flex flex-col items-center justify-center px-6"
    >
      <p class="text-subhead text-d-text-hint text-center mb-4">Не удалось загрузить услугу</p>
      <button class="press btn btn-secondary h-11 px-5 text-body" @click="load">Повторить</button>
    </div>

    <template v-else>
      <div class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
        <!-- репетитор -->
        <div class="reveal flex items-center gap-3 mb-4">
          <AvatarChip :name="service.tutor?.name" size="lg" />
          <div>
            <div class="text-[17px] font-semibold">{{ service.tutor?.name || 'Репетитор' }}</div>
            <div class="text-caption text-d-text-hint mt-0.5">
              {{ service.subject?.name }} · {{ service.teacher?.fullName }}
            </div>
          </div>
        </div>

        <ReputationHero
          v-if="!isMine"
          class="mb-4"
          :rating="rating"
          :reviews-count="reviewsCount"
          :distribution="distribution"
        />

        <!-- цена -->
        <div
          class="reveal bg-d-panel border border-d-border rounded-[13px] p-3.5 mb-4"
          style="animation-delay: 0.09s"
        >
          <div class="text-overline uppercase text-d-text-hint mb-1.5">Цена занятия</div>
          <div class="text-[24px] font-bold tnum">{{ formatKopeks(service.price) }}</div>
        </div>

        <template v-if="service.description">
          <div
            class="reveal text-overline uppercase text-d-text-hint mb-2.5"
            style="animation-delay: 0.12s"
          >
            Описание
          </div>
          <p
            class="reveal text-body text-d-text-bright"
            :class="isMine ? 'mb-6' : ''"
            style="animation-delay: 0.12s"
          >
            {{ service.description }}
          </p>
        </template>

        <!-- записи: принять или отказать может только владелец услуги -->
        <template v-if="isMine">
          <div class="text-overline uppercase text-d-text-hint mb-3">Записи · кого записать</div>
          <div v-if="bookings.length" class="flex flex-col gap-3">
            <IncomingBookingCard
              v-for="(b, i) in bookings"
              :key="b.id"
              :booking="b"
              :service-price="service.price"
              :busy="deciding"
              :delay="delay(i)"
              @accept="accept"
              @reject="reject"
              @open-deal="goDeals"
            />
          </div>
          <p v-else class="text-subhead text-d-text-hint">
            {{
              isListed
                ? 'Пока никто не записался. Услуга видна в ленте — студенты найдут её по предмету.'
                : 'Услуга скрыта из ленты, новых записей не будет.'
            }}
          </p>
        </template>
      </div>

      <!-- чужая услуга: запись в одно касание -->
      <div
        v-if="!isMine"
        class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
      >
        <div
          v-if="bookingStatus"
          class="h-[52px] rounded-[13px] border-[1.5px] flex items-center justify-center gap-2 text-[15px] font-semibold"
          :class="
            bookingDeclined ? 'border-d-border text-d-text-second' : 'border-d-act text-d-act'
          "
        >
          {{ bookingLabel }}
        </div>
        <ActionButton v-else :loading="booking" @click="book">Записаться</ActionButton>
      </div>
    </template>

    <ActionsSheet
      v-model="actionsSheet"
      title="Действия с услугой"
      :actions="actions"
      @pick="onAction"
    />
  </div>
</template>
