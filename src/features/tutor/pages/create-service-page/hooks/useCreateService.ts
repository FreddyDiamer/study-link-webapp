import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useService } from '@/shared/composables'
import type { SelectOption } from '@/shared/components/ui'
import type { CreateServiceDto } from '@/shared/types'
import { PATHS } from '@/router/paths'
import { DEADLINES } from '../models'

export interface CreateServiceForm {
  subject: SelectOption | null
  teacher: SelectOption | null
  description: string
  price: string
  deadline: SelectOption | null
  customDate: string
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
    deadline: null,
    customDate: '',
  })

  const subjectOptions = computed(() =>
    activeSubjects.value.map((s) => ({ value: s.id, label: s.name })),
  )
  const teacherOptions = computed(() =>
    teachers.value.map((t) => ({ value: t.id, label: t.fullName })),
  )

  const isSubmitting = ref(false)

  function getDeadlineDate(): string | undefined {
    if (!form.deadline) return undefined
    const now = new Date()
    switch (form.deadline.value) {
      case '1':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      case '3':
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
      case '7':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      case 'custom':
        return form.customDate ? new Date(form.customDate).toISOString() : undefined
      default:
        return undefined
    }
  }

  function validateForm(): boolean {
    return !!(
      form.subject &&
      form.teacher &&
      form.description.trim() &&
      form.price &&
      parseInt(form.price) > 0 &&
      form.deadline &&
      (form.deadline.value !== 'custom' || form.customDate)
    )
  }

  async function submitService() {
    if (!validateForm()) return
    if (!form.subject || !form.teacher) {
      telegramStore.showAlert('Укажите предмет и преподавателя')
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
        deadline: getDeadlineDate(),
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
    deadlines: DEADLINES,
    educationLoading,
    educationError,
    initialize,
    isSubmitting,
    validateForm,
    submitService,
    goBack,
  }
}
