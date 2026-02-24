import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useService } from '@/shared/composables'
import type { SelectOption } from '@/shared/components/ui'
import type { CreateServiceDto } from '@/shared/types'
import { PATHS } from '@/router/paths'
import { LESSON_DURATION_OPTIONS } from '../models'

export interface CreateServiceForm {
  subject: SelectOption | null
  teacher: SelectOption | null
  description: string
  price: string
  lessonsCount: string
  lessonDurationMinutes: SelectOption | null
}

export function useCreateService() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const createServiceMutation = useService().createService()
  const {
    activeSubjects,
    teachers,
    isLoading: educationLoading,
    error: educationError,
    isInitialized,
    initialize,
  } = useEducation()

  const form = reactive<CreateServiceForm>({
    subject: null,
    teacher: null,
    description: '',
    price: '',
    lessonsCount: '',
    lessonDurationMinutes: null,
  })

  const subjectOptions = computed(() =>
    activeSubjects.value.map((s) => ({ value: s.id, label: s.name })),
  )
  const teacherOptions = computed(() =>
    teachers.value.map((t) => ({ value: t.id, label: t.fullName })),
  )

  const isSubmitting = ref(false)

  function validateForm(): boolean {
    const lessonsNum = parseInt(form.lessonsCount, 10)
    return !!(
      form.subject &&
      form.teacher &&
      form.description.trim() &&
      form.price &&
      parseInt(form.price) > 0 &&
      form.lessonsCount &&
      !isNaN(lessonsNum) &&
      lessonsNum >= 1 &&
      lessonsNum <= 200 &&
      form.lessonDurationMinutes
    )
  }

  async function submitService() {
    if (!validateForm()) return
    if (!form.subject || !form.teacher || !form.lessonDurationMinutes) {
      telegramStore.showAlert('Укажите предмет, преподавателя и длительность занятия')
      return
    }
    const lessonsNum = parseInt(form.lessonsCount, 10)
    if (isNaN(lessonsNum) || lessonsNum < 1 || lessonsNum > 200) {
      telegramStore.showAlert('Количество занятий: от 1 до 200')
      return
    }
    const durationNum = parseInt(form.lessonDurationMinutes.value, 10)
    if (isNaN(durationNum) || durationNum < 15 || durationNum > 180) {
      telegramStore.showAlert('Длительность занятия: от 15 до 180 минут')
      return
    }
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      const serviceData: CreateServiceDto = {
        subjectId: form.subject.value,
        teacherId: form.teacher.value,
        description: form.description,
        price: parseInt(form.price),
        lessonsCount: lessonsNum,
        lessonDurationMinutes: durationNum,
      }
      await createServiceMutation.mutateAsync(serviceData)
      telegramStore.hapticFeedback('heavy')
      router.push(PATHS.TUTOR_SERVICES)
    } catch (error: any) {
      console.error('Ошибка создания услуги:', error)
      telegramStore.showAlert('Ошибка при создании услуги. Попробуйте снова.')
    } finally {
      isSubmitting.value = false
    }
  }

  function goBack() {
    telegramStore.hapticFeedback('light')
    router.back()
  }

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
  })

  return {
    form,
    subjectOptions,
    teacherOptions,
    lessonDurationOptions: LESSON_DURATION_OPTIONS,
    educationLoading,
    educationError,
    initialize,
    isSubmitting,
    validateForm,
    submitService,
    goBack,
  }
}
