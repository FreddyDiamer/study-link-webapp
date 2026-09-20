<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useKeptScroll, usePullToRefresh, useOrder, useService } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS, requestDetailPath, serviceDetailPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { LoadError, SegmentControl } from '@/shared/components/ui'
import SearchField from '../components/SearchField.vue'
import SubjectChips from '../components/SubjectChips.vue'
import ServiceCard from '../components/ServiceCard.vue'
import RequestCard from '../components/RequestCard.vue'
import CardSkeleton from '../components/CardSkeleton.vue'
import EmptyFeed from '../components/EmptyFeed.vue'
import EmptyMarket from '../components/EmptyMarket.vue'
import FeedEnd from '../components/FeedEnd.vue'
import CreateIntentSheet from '../components/CreateIntentSheet.vue'
import type { Request, Service } from '@/shared/types'

type MarketSeg = 'requests' | 'services'

// порядок как в макете: сначала «Заявки», потом «Услуги»
const SEGMENTS = [
  { id: 'requests', label: 'Заявки' },
  { id: 'services', label: 'Услуги' },
] as const

const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getActiveServices } = useService()
const { getRequests } = useOrder()

// в макете лента открывается на «Заявках»: роль задаётся тем, что листаешь
const segment = ref<MarketSeg>('requests')
const subjectId = ref('')
const query = ref('')
const loading = ref(true)
// пустота и сбой должны выглядеть по-разному: у пустоты «создать», у сбоя «повторить»
const failed = ref(false)
const errorCode = ref<number | string | undefined>()
const lastTry = ref('')
const intentSheet = ref(false)
const services = ref<Service[]>([])
const requests = ref<Request[]>([])

const isRequests = computed(() => segment.value === 'requests')

const matches = (haystack: (string | undefined)[]) => {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  return haystack.some((value) => value?.toLowerCase().includes(q))
}

const visibleRequests = computed(() =>
  requests.value.filter(
    (r) =>
      (!subjectId.value || r.subjectId === subjectId.value) &&
      matches([r.subject?.name, r.teacher?.fullName, r.student?.name, r.description]),
  ),
)

const visibleServices = computed(() =>
  services.value.filter(
    (s) =>
      (!subjectId.value || s.subjectId === subjectId.value) &&
      matches([s.subject?.name, s.teacher?.fullName, s.tutor?.name, s.description]),
  ),
)

const isEmpty = computed(() =>
  isRequests.value ? !visibleRequests.value.length : !visibleServices.value.length,
)
const isFiltered = computed(() => !!subjectId.value || !!query.value.trim())

// короткая лента без фильтра — это не «мало результатов», а ранний продукт:
// её нужно закрыть смыслом, а не оборвать
const visibleCount = computed(() =>
  isRequests.value ? visibleRequests.value.length : visibleServices.value.length,
)
const showFeedEnd = computed(
  () => !isFiltered.value && visibleCount.value > 0 && visibleCount.value <= 3,
)
const feedEndLabel = computed(() =>
  isRequests.value ? 'Это все заявки на сегодня' : 'Это все услуги на сегодня',
)

const headerSub = computed(() => (isRequests.value ? 'Кому нужна помощь' : 'Кто предлагает помощь'))
const feedHint = computed(() =>
  isRequests.value
    ? 'Кому нужна помощь — здесь вы исполнитель'
    : 'Кто предлагает помощь — здесь вы заказчик',
)
const searchHint = computed(() => (isRequests.value ? 'Поиск по заявкам' : 'Поиск по услугам'))
const emptyTitle = computed(() =>
  isFiltered.value
    ? isRequests.value
      ? 'Заявок по этому предмету нет'
      : 'Услуг по этому предмету нет'
    : isRequests.value
      ? 'Заявок пока нет'
      : 'Услуг пока нет',
)

// silent — возврат на экран: лента остаётся на месте, данные подменяются под ней
const load = async (silent = false) => {
  if (!silent) loading.value = true
  try {
    const [svc, req] = await Promise.all([getActiveServices(), getRequests()])
    services.value = svc?.items ?? []
    requests.value = req?.items ?? []
    failed.value = false
  } catch (e) {
    console.error('Не удалось загрузить ленту:', e)
    failed.value = true
    errorCode.value = (e as { response?: { status?: number } })?.response?.status
    lastTry.value = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } finally {
    loading.value = false
  }
}

const scroller = ref<HTMLElement | null>(null)
const { pull, refreshing, bind } = usePullToRefresh(scroller, () => load())
const { revisited } = useKeptScroll(scroller, () => load(true))

const isMine = (request: Request) => request.studentId === auth.user?.id
const isMyService = (service: Service) => service.tutorId === auth.user?.id

const openService = (id: string) => {
  telegramStore.hapticFeedback('light')
  router.push(serviceDetailPath(id))
}

const openRequest = (id: string) => {
  telegramStore.hapticFeedback('light')
  router.push(requestDetailPath(id))
}

const resetFilter = () => {
  subjectId.value = ''
  query.value = ''
}

const delay = (i: number) => `${i * 0.07}s`

onMounted(() => load())
</script>

<template>
  <div class="flex flex-col h-full" :class="{ 'no-reveal': revisited }">
    <AppHeader title="Лента" :sub="headerSub" add @add="intentSheet = true" />

    <div class="shrink-0 px-[18px] pt-3.5 pb-2.5">
      <SegmentControl v-model="segment" :items="SEGMENTS" class="mb-3" />

      <!-- подсказка роли: она меняется вместе с сегментом -->
      <div class="flex items-center gap-[7px] mb-2.5">
        <span
          class="shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-300"
          :class="isRequests ? 'bg-d-accent' : 'bg-d-rating'"
        />
        <span class="text-[11px] text-d-text-hint">{{ feedHint }}</span>
      </div>

      <SearchField v-model="query" :placeholder="searchHint" class="mb-3" />
      <SubjectChips v-model="subjectId" />
    </div>

    <div
      ref="scroller"
      class="relative flex-1 overflow-y-auto px-[18px] pt-1.5 pb-[18px]"
      v-bind="bind()"
    >
      <!-- потянули вниз: старые карточки остаются на месте и притухают -->
      <div
        class="flex items-center justify-center gap-2 overflow-hidden transition-[height] duration-200"
        :style="{ height: `${pull}px` }"
      >
        <span
          v-if="pull > 0"
          class="w-4 h-4 rounded-full border-2 border-d-border-soft border-t-d-accent"
          :class="refreshing ? 'animate-d-spin' : ''"
        />
        <span v-if="pull > 24" class="text-caption text-d-text-hint">
          {{ refreshing ? 'Обновляем ленту' : 'Отпустите, чтобы обновить' }}
        </span>
      </div>

      <!-- контент догоняет едущую пилюлю сегмента, а не подменяется рывком -->
      <Transition name="swap" mode="out-in">
        <div
          :key="`${segment}-${loading}-${failed}`"
          class="flex flex-col gap-3 transition-opacity"
          :class="refreshing ? 'opacity-60' : ''"
        >
          <template v-if="loading && !refreshing">
            <CardSkeleton v-for="n in 4" :key="n" />
          </template>

          <!-- сбой: не пустота. знак «!», текст «заявки на месте», действие «Повторить» -->
          <LoadError
            v-else-if="failed"
            title="Не получилось загрузить ленту"
            text="Заявки на месте — до них не дошёл ответ сервера. Проверьте соединение и попробуйте ещё раз."
            :code="errorCode"
            :at="lastTry"
            :loading="loading"
            @retry="load()"
          />

          <!-- фильтр ничего не нашёл -->
          <EmptyFeed
            v-else-if="isEmpty && isFiltered"
            :title="emptyTitle"
            filtered
            @reset="resetFilter"
          />

          <!-- на платформе пока никого: зовём на другую сторону сделки -->
          <EmptyMarket
            v-else-if="isEmpty && isRequests"
            title="Заявок пока никто не опубликовал"
            text="Вы можете быть первым: заявку увидят все репетиторы по вашему предмету."
            primary-label="Создать заявку"
            secondary-label="Смотреть услуги"
            @primary="router.push(PATHS.REQUEST_CREATE)"
            @secondary="segment = 'services'"
          />
          <EmptyMarket
            v-else-if="isEmpty"
            title="Услуг пока никто не опубликовал"
            text="Вы можете быть первым: услуга встанет в начало ленты и её увидят все, кто ищет помощь по вашему предмету."
            primary-label="Предложить услугу"
            secondary-label="Смотреть заявки"
            @primary="router.push(PATHS.SERVICE_CREATE)"
            @secondary="segment = 'requests'"
          />

          <template v-else-if="isRequests">
            <RequestCard
              v-for="(q, i) in visibleRequests"
              :key="q.id"
              :request="q"
              :mine="isMine(q)"
              :delay="delay(i)"
              @click="openRequest(q.id)"
            />
          </template>

          <template v-else>
            <ServiceCard
              v-for="(s, i) in visibleServices"
              :key="s.id"
              :service="s"
              :mine="isMyService(s)"
              :delay="delay(i)"
              @click="openService(s.id)"
            />
          </template>

          <FeedEnd
            v-if="showFeedEnd"
            :label="feedEndLabel"
            @create-service="router.push(PATHS.SERVICE_CREATE)"
          />
        </div>
      </Transition>
    </div>

    <CreateIntentSheet
      v-model="intentSheet"
      @request="router.push(PATHS.REQUEST_CREATE)"
      @service="router.push(PATHS.SERVICE_CREATE)"
    />
  </div>
</template>
