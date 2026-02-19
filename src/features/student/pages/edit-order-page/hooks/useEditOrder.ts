import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables'
import { DEADLINES, URGENCY_OPTIONS } from '../models'

const SUBJECTS = [
  { value: 'mathematics', label: 'Математика' },
  { value: 'physics', label: 'Физика' },
  { value: 'chemistry', label: 'Химия' },
  { value: 'other', label: 'Другое' },
]
const TEACHERS = [
  { value: 'teacher1', label: 'Подготовка к ЕГЭ' },
  { value: 'teacher2', label: 'Олимпиадная подготовка' },
  { value: 'teacher3', label: 'Школьная программа' },
]

export function useEditOrder() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getRequest, updateRequest, deleteRequest } = useOrder()
  const orderId = route.params.id as string

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
  const isSubmitting = ref(false)
  const isLoading = ref(true)
  const showDeleteModal = ref(false)

  const loadOrder = async () => {
    isLoading.value = true
    try {
      const order = await getRequest(orderId)
      if (order) {
        form.subject = (order as any).subjectId || order.subject?.id || ''
        form.teacher = (order as any).teacherId || order.teacher?.id || ''
        form.description = order.description || ''
        form.budget = order.budget?.toString() || ''
        form.deadline = 'week'
        form.customDate = order.deadline ? order.deadline.slice(0, 10) : ''
        form.urgency = 'normal'
      }
    } catch {
      // fallback mock
      form.subject = 'mathematics'
      form.teacher = 'teacher1'
      form.description = 'Подготовка к ЕГЭ'
      form.budget = '2000'
      form.deadline = 'week'
      form.urgency = 'normal'
    } finally {
      isLoading.value = false
    }
  }

  const validateForm = () => {
    const hasSubject = form.subject && (form.subject !== 'other' || form.customSubject)
    const hasDeadline = form.deadline && (form.deadline !== 'custom' || form.customDate)
    return !!(hasSubject && form.description && form.budget && hasDeadline)
  }

  const submitOrder = async () => {
    if (!validateForm()) return
    isSubmitting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      await updateRequest(orderId, {
        subjectId: form.subject,
        teacherId: form.teacher || undefined,
        description: form.description,
        budget: form.budget ? parseInt(form.budget, 10) : undefined,
        deadline: form.deadline === 'custom' && form.customDate ? new Date(form.customDate).toISOString() : undefined,
      })
      telegramStore.hapticFeedback('heavy')
      router.push('/student/orders')
    } catch (error) {
      console.error(error)
      telegramStore.showAlert('Ошибка при сохранении заявки.')
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteOrder = async () => {
    showDeleteModal.value = false
    isSubmitting.value = true
    try {
      await deleteRequest(orderId)
      router.push('/student/orders')
    } catch (error) {
      console.error(error)
      telegramStore.showAlert('Ошибка при удалении заявки.')
    } finally {
      isSubmitting.value = false
    }
  }

  const goBack = () => {
    telegramStore.hapticFeedback('light')
    router.back()
  }

  onMounted(() => loadOrder())

  return {
    form,
    subjects: SUBJECTS,
    teachers: TEACHERS,
    deadlines: DEADLINES,
    urgencyOptions: URGENCY_OPTIONS,
    isLoading,
    isSubmitting,
    showDeleteModal,
    loadOrder,
    validateForm,
    submitOrder,
    deleteOrder,
    goBack,
  }
}
