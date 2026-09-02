<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEducation, useOrder, useToast } from '@/shared/composables'
import { useAuthStore, useEducationStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS, requestDetailPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { DateField, MoneyInput } from '@/shared/components/ui'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const edu = useEducationStore()
const telegramStore = useTelegramStore()
const { initialize, isInitialized } = useEducation()
const { getRequest, createRequest, updateRequest } = useOrder()
const { showToast } = useToast()

const editingId = computed(() => (route.name === 'request-edit' ? (route.params.id as string) : ''))
const isEditing = computed(() => !!editingId.value)

const subjectId = ref('')
const teacherId = ref('')
const budget = ref('')
const deadline = ref('')
const description = ref('')
const submitting = ref(false)
const error = ref('')

const teachersForSubject = computed(() => {
  const list = subjectId.value ? edu.getTeachersBySubject(subjectId.value) : []
  return list.length ? list : edu.teachers
})

// при смене предмета сбрасываем преподавателя, если он больше не подходит
watch(subjectId, () => {
  if (!teachersForSubject.value.some((t) => t.id === teacherId.value)) teacherId.value = ''
})

const canSubmit = computed(() => !!subjectId.value && !!teacherId.value && !submitting.value)

const title = computed(() => (isEditing.value ? 'Изменить заявку' : 'Новая заявка'))
const submitLabel = computed(() =>
  isEditing.value ? 'Сохранить изменения' : 'Опубликовать заявку',
)

const budgetKopeks = computed(() =>
  budget.value ? Math.round(Number(budget.value) * 100) : undefined,
)

const submit = async () => {
  if (!canSubmit.value || !auth.user?.id) return
  submitting.value = true
  error.value = ''
  try {
    if (isEditing.value) {
      await updateRequest(editingId.value, {
        description: description.value || undefined,
        budget: budgetKopeks.value,
        deadline: deadline.value || undefined,
      })
      telegramStore.hapticFeedback('success')
      showToast('Заявка обновлена')
      router.push(requestDetailPath(editingId.value))
    } else {
      const created = await createRequest({
        studentId: auth.user.id,
        subjectId: subjectId.value,
        teacherId: teacherId.value,
        description: description.value || undefined,
        budget: budgetKopeks.value,
        deadline: deadline.value || undefined,
      })
      telegramStore.hapticFeedback('success')
      showToast('Заявка опубликована')
      router.push(created?.id ? requestDetailPath(created.id) : PATHS.MARKET)
    }
  } catch (e) {
    console.error('Не удалось сохранить заявку:', e)
    error.value = 'Не удалось сохранить заявку. Попробуйте ещё раз.'
    submitting.value = false
  }
}

onMounted(async () => {
  if (!isInitialized.value) initialize().catch((e) => console.error(e))
  if (!isEditing.value) return
  try {
    const request = await getRequest(editingId.value)
    subjectId.value = request.subjectId
    teacherId.value = request.teacherId
    budget.value = request.budget ? String(Math.round(request.budget / 100)) : ''
    deadline.value = request.deadline ? request.deadline.slice(0, 10) : ''
    description.value = request.description ?? ''
  } catch (e) {
    console.error('Не удалось загрузить заявку:', e)
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader :title="title" :sub="isEditing ? '' : 'Вы заказчик'" back />

    <div class="flex-1 overflow-y-auto px-[18px] py-4">
      <!-- предмет -->
      <label class="block text-overline uppercase text-d-text-second mb-2.5">
        Предмет <span class="text-d-accent">*</span>
      </label>
      <div class="relative mb-[18px]">
        <select
          v-model="subjectId"
          :disabled="isEditing"
          class="d-select w-full h-[54px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 pr-10 text-body appearance-none focus:border-d-accent focus:outline-none transition-colors disabled:opacity-60"
          :class="subjectId ? 'text-d-text' : 'text-d-text-hint'"
        >
          <option value="" disabled>Выберите предмет</option>
          <option v-for="s in edu.activeSubjects" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-d-text-hint"
          >›</span
        >
      </div>

      <!-- преподаватель -->
      <label class="block text-overline uppercase text-d-text-second mb-2.5">
        Преподаватель <span class="text-d-accent">*</span>
      </label>
      <div class="relative mb-[18px]">
        <select
          v-model="teacherId"
          :disabled="!subjectId || isEditing"
          class="d-select w-full h-[54px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 pr-10 text-body appearance-none focus:border-d-accent focus:outline-none transition-colors disabled:opacity-60"
          :class="teacherId ? 'text-d-text' : 'text-d-text-hint'"
        >
          <option value="" disabled>Сначала выберите предмет</option>
          <option v-for="t in teachersForSubject" :key="t.id" :value="t.id">
            {{ t.fullName }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-d-text-hint"
          >›</span
        >
      </div>

      <!-- бюджет -->
      <label class="block text-overline uppercase text-d-text-second mb-2.5">Бюджет</label>
      <MoneyInput v-model="budget" placeholder="2 000" class="mb-[18px]" />

      <!-- срок -->
      <label class="block text-overline uppercase text-d-text-second mb-2.5">Срок</label>
      <DateField v-model="deadline" class="mb-[18px]" />

      <!-- описание -->
      <label class="block text-overline uppercase text-d-text-second mb-2.5">Описание</label>
      <textarea
        v-model="description"
        rows="3"
        placeholder="Опишите, с чем нужна помощь"
        class="w-full min-h-[88px] rounded-[12px] bg-d-panel border border-d-border-soft focus:border-d-accent focus:outline-none px-4 py-3.5 text-body leading-[1.45] resize-none transition-colors"
      />

      <p v-if="error" class="text-caption text-d-coral mt-3">{{ error }}</p>
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <button
        class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold disabled:opacity-40"
        :disabled="!canSubmit"
        @click="submit"
      >
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* тёмная нативная выпадашка */
.d-select {
  color-scheme: dark;
}
</style>
