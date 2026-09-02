<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reviewService, userService } from '@/services/business'
import { useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReviewItem from '@/shared/components/ReviewItem.vue'
import ReputationPair from '../components/ReputationPair.vue'
import GroupSheet from '../components/GroupSheet.vue'
import { countWithWord, formatKopeks } from '@/shared/utils'
import { requestDetailPath } from '@/router/paths'
import { UserRole, type Request, type Review, type User } from '@/shared/types'

const router = useRouter()
const auth = useAuthStore()
const { getMyRequests } = useOrder()
const { showToast } = useToast()

const loading = ref(true)
const groupSheet = ref(false)
const profile = ref<User | null>(null)
const reviews = ref<Review[]>([])
const myRequests = ref<Request[]>([])

const reputationFor = (role: UserRole) => {
  const scoped = reviews.value.filter((r) => r.targetRole === role)
  if (!scoped.length) return { rating: 0, count: 0 }
  const total = scoped.reduce((sum, r) => sum + r.rating, 0)
  return { rating: Math.round((total / scoped.length) * 10) / 10, count: scoped.length }
}

// две репутации: за работу исполнителем и за поведение заказчиком
const tutorReputation = computed(() => reputationFor(UserRole.TUTOR))
const studentReputation = computed(() => reputationFor(UserRole.STUDENT))

const recentReviews = computed(() => reviews.value.slice(0, 3))

const load = async () => {
  loading.value = true
  try {
    const me = await userService.getProfile()
    profile.value = me
    if (me?.id) reviews.value = await reviewService.getUserReviews(me.id)
    const requests = await getMyRequests()
    myRequests.value = requests?.items ?? []
  } catch (e) {
    console.error('Не удалось загрузить профиль:', e)
    profile.value = (auth.user as User) ?? null
  } finally {
    loading.value = false
  }
}

const pickGroup = async (groupId: string) => {
  try {
    profile.value = await userService.updateGroup(groupId)
    showToast('Группа обновлена')
  } catch (e) {
    console.error('Не удалось сменить группу:', e)
  }
}

const budgetText = (request: Request) =>
  request.budget && request.budget > 0 ? `до ${formatKopeks(request.budget)}` : 'Бюджет не указан'

const responsesLabel = (request: Request) =>
  countWithWord(request.responses?.length ?? 0, 'отклик', 'отклика', 'откликов')

const roleOf = (review: Review) => (review.targetRole === UserRole.TUTOR ? 'tutor' : 'student')

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Профиль" />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <div v-else-if="profile" class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
      <!-- кто вы -->
      <div class="reveal flex items-center gap-3.5 mb-[18px]">
        <AvatarChip :name="profile.name" size="xl" />
        <div>
          <div class="text-title-l">{{ profile.name }}</div>
          <div v-if="profile.telegramUsername" class="text-caption text-d-text-hint mt-0.5">
            @{{ profile.telegramUsername }}
          </div>
        </div>
      </div>

      <!-- группа: единственная настройка, оставшаяся в MVP -->
      <button
        class="press reveal w-full flex items-center bg-d-panel border border-d-border rounded-[14px] px-4 py-[15px] mb-3.5 text-left"
        style="animation-delay: 0.04s"
        @click="groupSheet = true"
      >
        <span>
          <span class="block text-overline uppercase text-d-text-hint mb-1">Группа</span>
          <span class="block text-[16px] font-semibold">
            {{ profile.group?.number || 'Не выбрана' }}
          </span>
        </span>
        <span class="ml-auto text-subhead font-semibold text-d-accent">Изменить</span>
      </button>

      <ReputationPair
        class="reveal mb-3.5"
        style="animation-delay: 0.07s"
        :tutor="tutorReputation"
        :student="studentReputation"
      />

      <!-- отзывы -->
      <div
        class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-3.5"
        style="animation-delay: 0.09s"
      >
        <div class="text-overline uppercase text-d-text-hint mb-1">Отзывы о вас</div>
        <ReviewItem
          v-for="r in recentReviews"
          :key="r.id"
          bare
          :author="r.author?.name || 'Аноним'"
          :rating="r.rating"
          :text="r.comment"
          :role="roleOf(r)"
        />
        <p v-if="!reviews.length" class="text-subhead text-d-text-hint mt-3">Пока нет отзывов</p>
      </div>

      <!-- мои заявки -->
      <div
        class="reveal text-overline uppercase text-d-text-hint mb-2.5"
        style="animation-delay: 0.1s"
      >
        Мои заявки
      </div>
      <div v-if="myRequests.length" class="flex flex-col gap-2.5">
        <button
          v-for="request in myRequests"
          :key="request.id"
          class="press reveal w-full bg-d-panel border border-d-border rounded-[14px] p-[15px] text-left"
          style="animation-delay: 0.1s"
          @click="router.push(requestDetailPath(request.id))"
        >
          <div class="text-[16px] font-semibold mb-1.5">
            {{ request.subject?.name }} · {{ request.teacher?.fullName }}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[16px] font-bold tnum">{{ budgetText(request) }}</span>
            <span class="text-[12px] text-d-text-hint">{{ responsesLabel(request) }}</span>
          </div>
        </button>
      </div>
      <p v-else class="text-subhead text-d-text-hint">Вы ещё не создавали заявок</p>
    </div>

    <GroupSheet v-model="groupSheet" :current-id="profile?.groupId" @pick="pickGroup" />
  </div>
</template>
