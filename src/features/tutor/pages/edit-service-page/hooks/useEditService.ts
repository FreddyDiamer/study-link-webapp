import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useService } from '@/shared/composables'
import type { Service, UpdateServiceDto } from '@/shared/types'
import { PATHS } from '@/router/paths'
import { DEADLINES } from '../models'

export interface EditServiceForm {
  subject: string
  teacher: string
  description: string
  price: string
  deadline: string
  customDate: string
}

export function useEditService() {
  const router = useRouter()
  const route = useRoute()
  const telegramStore = useTelegramStore()
  const { getService, updateService, deleteService } = useService()
  const {
    activeSubjects,
    teachers,
    isLoading: educationLoading,
    error: educationError,
    isInitialized,
    initialize,
  } = useEducation()

  const serviceId = route.params.id as string
  const form = reactive<EditServiceForm>({
    subject: '',
    teacher: '',
    description: '',
    price: '',
    deadline: '',
    customDate: '',
  })

  const subjectOptions = computed(() =>
    activeSubjects.value.map((s) => ({ value: s.id, label: s.name })),
  )
  const teacherOptions = computed(() =>
    teachers.value.map((t) => ({ value: t.id, label: t.fullName })),
  )

  const isSubmitting = ref(false)
  const isLoading = ref(true)
  const showDeleteModal = ref(false)
  const service = ref<Service | null>(null)
  const error = ref<string | null>(null)

  function getDeadlineDate(): string | undefined {
    if (!form.deadline) return undefined
    const now = new Date()
    switch (form.deadline) {
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
      form.description.trim() &&
      form.price &&
      parseInt(form.price) > 0 &&
      form.deadline &&
      (form.deadline !== 'custom' || form.customDate)
    )
  }

  const loadService = async () => {
    if (!serviceId) return
    isLoading.value = true
    error.value = null
    try {
      const data = await getService(serviceId)
      service.value = data
      form.subject = data.subjectId || ''
      form.teacher = data.teacherId || ''
      form.description = data.description || ''
      form.price = data.price ? data.price.toString() : ''
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const now = new Date()
        const diffDays = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        )
        if (diffDays <= 1) form.deadline = '1'
        else if (diffDays <= 3) form.deadline = '3'
        else if (diffDays <= 7) form.deadline = '7'
        else {
          form.deadline = 'custom'
          form.customDate = deadlineDate.toISOString().split('T')[0]
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки услуги'
    } finally {
      isLoading.value = false
    }
  }

  const updateServiceData = async () => {
    if (!validateForm()) return
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      const updateData: UpdateServiceDto = {
        price: parseInt(form.price),
        description: form.description,
        deadline: getDeadlineDate(),
      }
      await updateService(serviceId, updateData)
      telegramStore.hapticFeedback('heavy')
      router.push(PATHS.TUTOR_SERVICES)
    } catch (err: any) {
      console.error('Ошибка обновления услуги:', err)
      telegramStore.showAlert('Ошибка при обновлении услуги. Попробуйте снова.')
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteServiceData = async () => {
    isSubmitting.value = true
    try {
      await deleteService(serviceId)
      showDeleteModal.value = false
      router.push(PATHS.TUTOR_SERVICES)
    } catch (err: any) {
      console.error('Ошибка удаления услуги:', err)
      telegramStore.showAlert('Ошибка при удалении услуги. Попробуйте снова.')
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
    await loadService()
  })

  return {
    serviceId,
    form,
    subjectOptions,
    teacherOptions,
    deadlines: DEADLINES,
    educationLoading,
    educationError,
    initialize,
    isSubmitting,
    isLoading,
    showDeleteModal,
    service,
    error,
    loadService,
    validateForm,
    updateServiceData,
    deleteServiceData,
    goBack,
  }
}
