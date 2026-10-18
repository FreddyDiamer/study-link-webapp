<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormExit, useService, useToast } from '@/shared/composables'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionButton } from '@/shared/components/ui'
import SubjectTeacherFields from '../components/SubjectTeacherFields.vue'
import type { SubjectOption, TeacherOption } from '@/shared/types'

const { exitTo } = useFormExit()
const telegramStore = useTelegramStore()
const { createService } = useService()
const { showToast } = useToast()

const subject = ref<SubjectOption | null>(null)
const teacher = ref<TeacherOption | null>(null)
const price = ref('')
const description = ref('')
const submitting = ref(false)

const canSubmit = computed(
  () => !!subject.value && !!teacher.value && Number(price.value) > 0 && !submitting.value,
)

const submit = async () => {
  if (!canSubmit.value || !subject.value || !teacher.value) return
  submitting.value = true
  try {
    await createService({
      subjectId: subject.value.id,
      teacherId: teacher.value.id,
      price: Math.round(Number(price.value) * 100), // рубли → копейки
      description: description.value || undefined,
    })
    telegramStore.hapticFeedback('success')
    showToast('Услуга опубликована')
    exitTo(PATHS.MARKET)
  } catch (e) {
    // причину уже показал алерт бизнес-слоя — второй текст здесь был бы дублем
    console.error('Не удалось создать услугу:', e)
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Новая услуга" sub="Вы исполнитель" back />

    <div class="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-5">
      <SubjectTeacherFields v-model:subject="subject" v-model:teacher="teacher" />

      <!-- цена -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">Цена занятия</label>
        <div
          class="flex items-center h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 focus-within:border-d-accent transition-colors"
        >
          <span class="text-body text-d-text-hint">₽</span>
          <input
            v-model="price"
            type="number"
            inputmode="numeric"
            placeholder="1 500"
            class="flex-1 bg-transparent text-right text-[20px] font-bold tnum focus:outline-none placeholder:text-d-text-hint placeholder:font-normal"
          />
        </div>
      </div>

      <!-- описание -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">
          Описание <span class="text-d-text-hint normal-case font-normal">· необязательно</span>
        </label>
        <textarea
          v-model="description"
          rows="3"
          placeholder="Помогу с пределами, производными и интегралами…"
          class="w-full min-h-[94px] rounded-[12px] bg-d-panel border border-d-border-soft focus:border-d-accent focus:outline-none px-4 py-3.5 text-body leading-[1.45] resize-none transition-colors"
        />
      </div>
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <ActionButton :loading="submitting" :disabled="!canSubmit" @click="submit">
        Опубликовать услугу
      </ActionButton>
    </div>
  </div>
</template>
