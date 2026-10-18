<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFormExit, useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS, requestDetailPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionButton, DateField, MoneyInput } from '@/shared/components/ui'
import SubjectTeacherFields from '../components/SubjectTeacherFields.vue'
import type { SubjectOption, TeacherOption } from '@/shared/types'

const route = useRoute()
const { exitTo } = useFormExit()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getRequest, createRequest, updateRequest } = useOrder()
const { showToast } = useToast()

const editingId = computed(() => (route.name === 'request-edit' ? (route.params.id as string) : ''))
const isEditing = computed(() => !!editingId.value)

const subject = ref<SubjectOption | null>(null)
const teacher = ref<TeacherOption | null>(null)
const budget = ref('')
const deadline = ref('')
const description = ref('')
const submitting = ref(false)

const canSubmit = computed(() => !!subject.value && !!teacher.value && !submitting.value)

const title = computed(() => (isEditing.value ? 'Изменить заявку' : 'Новая заявка'))
const submitLabel = computed(() =>
  isEditing.value ? 'Сохранить изменения' : 'Опубликовать заявку',
)

const budgetKopeks = computed(() =>
  budget.value ? Math.round(Number(budget.value) * 100) : undefined,
)

const submit = async () => {
  if (!canSubmit.value || !auth.user?.id || !subject.value || !teacher.value) return
  submitting.value = true
  try {
    if (isEditing.value) {
      await updateRequest(editingId.value, {
        description: description.value || undefined,
        budget: budgetKopeks.value,
        deadline: deadline.value || undefined,
      })
      telegramStore.hapticFeedback('success')
      showToast('Заявка обновлена')
      exitTo(requestDetailPath(editingId.value))
    } else {
      const created = await createRequest({
        studentId: auth.user.id,
        subjectId: subject.value.id,
        teacherId: teacher.value.id,
        description: description.value || undefined,
        budget: budgetKopeks.value,
        deadline: deadline.value || undefined,
      })
      telegramStore.hapticFeedback('success')
      showToast('Заявка опубликована')
      exitTo(created?.id ? requestDetailPath(created.id) : PATHS.MARKET)
    }
  } catch (e) {
    // причину уже показал алерт бизнес-слоя — второй текст здесь был бы дублем
    console.error('Не удалось сохранить заявку:', e)
    submitting.value = false
  }
}

onMounted(async () => {
  if (!isEditing.value) return
  try {
    const request = await getRequest(editingId.value)
    // справочник целиком не грузим — названия берём из самой заявки
    subject.value = { id: request.subjectId, name: request.subject?.name ?? 'Предмет' }
    teacher.value = { id: request.teacherId, fullName: request.teacher?.fullName ?? '—' }
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
      <SubjectTeacherFields
        v-model:subject="subject"
        v-model:teacher="teacher"
        :disabled="isEditing"
        class="mb-[18px]"
      />

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
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <ActionButton :loading="submitting" :disabled="!canSubmit" @click="submit">
        {{ submitLabel }}
      </ActionButton>
    </div>
  </div>
</template>
