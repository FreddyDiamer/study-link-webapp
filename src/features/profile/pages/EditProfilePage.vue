<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import { userService } from '@/services/business'
import { useEducation, useFormExit, useToast } from '@/shared/composables'
import { useAuthStore, useEducationStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionButton } from '@/shared/components/ui'
import GroupSheet from '../components/GroupSheet.vue'
import type { User } from '@/shared/types'

const { exitTo } = useFormExit()
const auth = useAuthStore()
const edu = useEducationStore()
const telegramStore = useTelegramStore()
const { initialize, isInitialized } = useEducation()
const { showToast } = useToast()

const DESCRIPTION_LIMIT = 400

const profile = ref<User | null>(null)
const name = ref('')
const description = ref('')
const groupId = ref('')
const groupSheet = ref(false)
const groupFieldId = useId()
const saving = ref(false)
const error = ref('')

// группа сохраняется вместе с остальным профилем, по кнопке «Сохранить»
const groupNumber = computed(() => edu.groups.find((g) => g.id === groupId.value)?.number ?? '')

const descriptionLength = computed(() => description.value.length)
const hasReviews = computed(() => (profile.value?.reviewsCount ?? 0) > 0)

const canSave = computed(
  () =>
    name.value.trim().length >= 2 && descriptionLength.value <= DESCRIPTION_LIMIT && !saving.value,
)

const save = async () => {
  if (!canSave.value) return
  saving.value = true
  error.value = ''
  try {
    await userService.updateProfile({
      name: name.value.trim(),
      description: description.value.trim() || undefined,
    })
    if (groupId.value && groupId.value !== profile.value?.groupId) {
      await userService.updateGroup(groupId.value)
    }
    telegramStore.hapticFeedback('success')
    showToast('Профиль сохранён')
    exitTo(PATHS.PROFILE)
  } catch (e) {
    console.error('Не удалось сохранить профиль:', e)
    error.value = 'Не удалось сохранить. Попробуйте ещё раз.'
    saving.value = false
  }
}

onMounted(async () => {
  if (!isInitialized.value) initialize().catch((e) => console.error(e))
  try {
    const me = await userService.getProfile()
    profile.value = me
    name.value = me.name ?? ''
    description.value = me.description ?? ''
    groupId.value = me.groupId ?? ''
  } catch (e) {
    console.error('Не удалось загрузить профиль:', e)
    profile.value = (auth.user as User) ?? null
    name.value = auth.user?.name ?? ''
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader
      title="О себе"
      sub="Это видят все, кто открыл ваш профиль"
      back
      :back-to="PATHS.PROFILE"
    />

    <div class="flex-1 overflow-y-auto px-[18px] py-4">
      <label class="block text-overline uppercase text-d-text-second mb-2.5">Имя</label>
      <input
        v-model="name"
        type="text"
        class="w-full h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 text-body focus:border-d-accent focus:outline-none transition-colors mb-[18px]"
      />

      <div class="flex items-baseline mb-2.5">
        <label class="text-overline uppercase text-d-text-second">О себе</label>
        <span
          class="ml-auto text-caption tnum"
          :class="descriptionLength > DESCRIPTION_LIMIT ? 'text-d-coral' : 'text-d-text-hint'"
        >
          {{ descriptionLength }} / {{ DESCRIPTION_LIMIT }}
        </span>
      </div>
      <textarea
        v-model="description"
        rows="6"
        autofocus
        placeholder="Какие темы ведёте и как проходит занятие"
        class="w-full min-h-[150px] rounded-[12px] bg-d-panel border border-d-border-soft focus:border-d-accent focus:outline-none px-4 py-3.5 text-body leading-[1.45] resize-none transition-colors"
      />

      <!-- пока отзывов нет, выбирают именно по этому тексту -->
      <div
        v-if="!hasReviews"
        class="flex gap-2.5 bg-d-panel border border-d-border rounded-[12px] p-3.5 mt-3 mb-[18px]"
      >
        <span class="shrink-0 text-d-rating">★</span>
        <p class="text-caption text-d-text-second">
          Пока у вас нет отзывов, студенты выбирают по этому тексту. Напишите, какие темы ведёте и
          как проходит занятие.
        </p>
      </div>
      <div v-else class="mb-[18px]" />

      <label :for="groupFieldId" class="block text-overline uppercase text-d-text-second mb-2.5"
        >Группа</label
      >
      <!-- нативный select не умеет искать, а групп в университете сотни: открываем лист с поиском -->
      <button
        :id="groupFieldId"
        type="button"
        aria-haspopup="dialog"
        class="press w-full flex items-center h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 mb-[18px] text-body text-left focus:border-d-accent focus:outline-none transition-colors"
        @click="groupSheet = true"
      >
        <span :class="groupNumber ? 'text-d-text' : 'text-d-text-hint'">
          {{ groupNumber || 'Выберите группу' }}
        </span>
        <span class="ml-auto text-d-text-hint" aria-hidden="true">▾</span>
      </button>

      <label class="block text-overline uppercase text-d-text-second mb-2.5">Telegram</label>
      <div
        class="h-[52px] rounded-[12px] bg-d-panel border border-d-border px-4 flex items-center text-body text-d-text-second"
      >
        {{ profile?.telegramUsername ? `@${profile.telegramUsername}` : 'username не открыт' }}
      </div>
      <p class="text-caption text-d-text-hint mt-2">
        Имя и username берутся из Telegram при первом входе.
      </p>

      <p v-if="error" class="text-caption text-d-coral mt-3">{{ error }}</p>
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <ActionButton :loading="saving" :disabled="!canSave" @click="save">Сохранить</ActionButton>
    </div>

    <GroupSheet v-model="groupSheet" :current-id="groupId" @pick="groupId = $event" />
  </div>
</template>
