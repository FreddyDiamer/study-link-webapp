import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useAuthStore } from '@/stores'
import { useEducation } from '@/shared/composables'
import { orderService } from '@/services/business/order'
import { DEADLINES } from '../models'

export function useCreateOrder() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const authStore = useAuthStore()
  const { activeSubjects, teachers, isLoading: educationLoading, error: educationError, isInitialized, initialize } = useEducation()

  const form = reactive({
    subject: '',
    customSubject: '',
    teacher: '',
    budget: '',
    description: '',
    deadline: '',
    customDate: '',
    urgency: 'normal',
    schedule: '',
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
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    switch (form.deadline) {
      case 'day': return new Date(now + dayMs).toISOString()
      case 'week': return new Date(now + 7 * dayMs).toISOString()
      case 'endOfSemester': return new Date(now + 90 * dayMs).toISOString()
      case 'custom': return form.customDate ? new Date(form.customDate).toISOString() : undefined
      default: return undefined
    }
  }

  function validateForm(): boolean {
    const hasSubject = form.subject && (form.subject !== 'other' || form.customSubject)
    const hasDeadline = form.deadline && (form.deadline !== 'custom' || form.customDate)
    if (!authStore.user?.id) {
      telegramStore.showAlert('Ошибка авторизации. Войдите в систему.')
      return false
    }
    return !!(hasSubject && form.budget && hasDeadline)
  }

  async function submitOrder() {
    if (!validateForm()) return
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      await orderService.createRequest({
        studentId: authStore.user!.id,
        subjectId: form.subject === 'other' ? '' : form.subject,
        teacherId: form.teacher || undefined,
        description: form.description,
        budget: form.budget ? parseInt(form.budget, 10) : undefined,
        deadline: getDeadlineDate(),
      })
      telegramStore.hapticFeedback('heavy')
      router.push('/student/orders')
    } catch (error) {
      console.error(error)
      telegramStore.showAlert('Ошибка при создании заявки. Попробуйте снова.')
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
    submitOrder,
    validateForm,
    goBack,
  }
}
