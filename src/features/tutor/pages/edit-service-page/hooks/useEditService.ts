import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { serviceService } from '@/services/business/service'
import type { SelectOption } from '@/shared/components/ui'
import type { Service, UpdateServiceDto } from '@/shared/types'
import { PATHS } from '@/router/paths'
import { LESSON_DURATION_OPTIONS } from '../models'

export interface EditServiceForm {
  subject: string
  teacher: string
  description: string
  price: string
  lessonsCount: string
  lessonDurationMinutes: string
}

export function useEditService() {
  const router = useRouter()
  const route = useRoute()
  const telegramStore = useTelegramStore()
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
    lessonsCount: '',
    lessonDurationMinutes: '',
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

  function validateForm(): boolean {
    const lessonsNum = parseInt(form.lessonsCount, 10)
    return !!(
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

  const loadService = async () => {
    if (!serviceId) return
    isLoading.value = true
    error.value = null
    try {
      const data = await serviceService.getService(serviceId)
      service.value = data
      form.subject = data.subjectId || ''
      form.teacher = data.teacherId || ''
      form.description = data.description || ''
      form.price = data.price ? data.price.toString() : ''
      form.lessonsCount = data.lessonsCount != null ? String(data.lessonsCount) : ''
      form.lessonDurationMinutes = data.lessonDurationMinutes != null ? String(data.lessonDurationMinutes) : ''
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки услуги'
    } finally {
      isLoading.value = false
    }
  }

  const updateServiceData = async () => {
    if (!validateForm()) return
    const lessonsNum = parseInt(form.lessonsCount, 10)
    const durationNum = parseInt(form.lessonDurationMinutes, 10)
    if (isNaN(lessonsNum) || lessonsNum < 1 || lessonsNum > 200) {
      telegramStore.showAlert('Количество занятий: от 1 до 200')
      return
    }
    if (isNaN(durationNum) || durationNum < 15 || durationNum > 180) {
      telegramStore.showAlert('Длительность занятия: от 15 до 180 минут')
      return
    }
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      const updateData: UpdateServiceDto = {
        price: parseInt(form.price),
        description: form.description,
        lessonsCount: lessonsNum,
        lessonDurationMinutes: durationNum,
      }
      await serviceService.updateService(serviceId, updateData)
      telegramStore.hapticFeedback('heavy')
      router.push(PATHS.TUTOR_SERVICES)
    } catch (err: any) {
      console.error('Ошибка обновления услуги:', err)
      telegramStore.showAlert('Ошибка при обновлении услуги. Попробуйте снова.')
    } finally {
      isSubmitting.value = false
    }
  }

  const toggleFreeze = async () => {
    if (!service.value) return
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      if (service.value.status === 'ACTIVE') {
        const updated = await serviceService.deactivateService(serviceId)
        service.value = updated
        telegramStore.showAlert('Услуга заморожена')
      } else {
        const updated = await serviceService.activateService(serviceId)
        service.value = updated
        telegramStore.showAlert('Услуга активирована')
      }
    } catch (err: any) {
      console.error('Ошибка изменения статуса услуги:', err)
      telegramStore.showAlert('Ошибка при изменении статуса услуги. Попробуйте снова.')
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteServiceData = async () => {
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      await serviceService.deleteService(serviceId)
      showDeleteModal.value = false
      telegramStore.hapticFeedback('heavy')
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
    lessonDurationOptions: LESSON_DURATION_OPTIONS,
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
    toggleFreeze,
    deleteServiceData,
    goBack,
  }
}
