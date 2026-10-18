<script setup lang="ts">
import { ref } from 'vue'
import { useSubjectTeacherPicker } from '@/shared/composables'
import { useTelegramStore } from '@/stores/telegram'
import { PickerField, PickerSheet, type PickerOption } from '@/shared/components/ui'
import type { SubjectOption, TeacherOption } from '@/shared/types'

interface Props {
  /** редактирование: пара уже в сделке с откликами, менять её нельзя */
  disabled?: boolean
}
withDefaults(defineProps<Props>(), { disabled: false })

const subject = defineModel<SubjectOption | null>('subject', { required: true })
const teacher = defineModel<TeacherOption | null>('teacher', { required: true })

const telegramStore = useTelegramStore()
const picker = useSubjectTeacherPicker(subject, teacher)

const subjectSheet = ref(false)
const teacherSheet = ref(false)

const handlePickSubject = (option: PickerOption) => {
  telegramStore.hapticFeedback('light')
  picker.pickSubject(option)
}

const handlePickTeacher = (option: PickerOption) => {
  telegramStore.hapticFeedback('light')
  picker.pickTeacher(option)
}
</script>

<template>
  <div class="flex flex-col gap-[18px]">
    <PickerField
      label="Предмет"
      required
      clearable
      placeholder="Выберите предмет"
      :value="subject?.name"
      :disabled="disabled"
      @open="subjectSheet = true"
      @clear="subject = null"
    />
    <PickerField
      label="Преподаватель"
      required
      clearable
      placeholder="Выберите преподавателя"
      :value="teacher?.fullName"
      :disabled="disabled"
      @open="teacherSheet = true"
      @clear="teacher = null"
    />

    <PickerSheet
      v-model="subjectSheet"
      v-model:query="picker.subjectQuery.value"
      title="Предмет"
      placeholder="Название предмета"
      :sub="picker.subjectSheetSub.value"
      :sections="picker.subjectSections.value"
      :current-id="subject?.id"
      :loading="picker.subjectLoading.value"
      :failed="picker.subjectFailed.value"
      :empty-text="picker.subjectEmptyText.value"
      :hint="picker.subjectHint.value"
      @pick="handlePickSubject"
      @retry="picker.retrySubjects"
    />
    <PickerSheet
      v-model="teacherSheet"
      v-model:query="picker.teacherQuery.value"
      title="Преподаватель"
      placeholder="Фамилия преподавателя"
      :sub="picker.teacherSheetSub.value"
      :sections="picker.teacherSections.value"
      :current-id="teacher?.id"
      :loading="picker.teacherLoading.value"
      :failed="picker.teacherFailed.value"
      :empty-text="picker.teacherEmptyText.value"
      :hint="picker.teacherHint.value"
      @pick="handlePickTeacher"
      @retry="picker.retryTeachers"
    />
  </div>
</template>
