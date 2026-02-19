import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import type { ResponseTabId, ServiceInfo, ServiceResponseItem } from '../models'
import { getResponseStatusInfo, formatResponseDate, formatResponseDeadline } from '../models'

const MOCK_SERVICE: ServiceInfo = {
  id: '1',
  tutorId: 'tutor-1',
  subjectId: 'math-1',
  teacherId: 'teacher-1',
  price: 220000,
  description: 'Подготовка к ЕГЭ по математике',
  workingHours: 'Пн-Пт 18:00-22:00',
  status: 'ACTIVE',
  deadline: null,
  createdAt: '2024-01-10T10:00:00',
  updatedAt: '2024-01-18T10:00:00',
  subject: { name: 'Математика' },
  teacher: { fullName: 'Подготовка к ЕГЭ' },
}

const MOCK_RESPONSES: ServiceResponseItem[] = [
  {
    id: '1',
    studentId: 'student-1',
    serviceId: 'service-1',
    message:
      'Здравствуйте! Мне нужна помощь в подготовке к ЕГЭ по математике. Особенно сложно даются задания по геометрии.',
    price: 220000,
    proposedDeadline: '2024-01-22T18:00:00',
    status: 'PENDING',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    student: { name: 'Анна Петрова', rating: 4.5 },
    service: {
      price: 220000,
      subject: { name: 'Математика' },
      teacher: { fullName: 'Подготовка к ЕГЭ' },
    },
  },
  {
    id: '2',
    studentId: 'student-2',
    serviceId: 'service-1',
    message:
      'Нужна помощь с алгеброй, готовлюсь к ЕГЭ заранее. Хотелось бы заниматься 2 раза в неделю.',
    price: 200000,
    proposedDeadline: '2024-01-20T16:00:00',
    status: 'ACCEPTED',
    createdAt: '2024-01-14T15:20:00',
    updatedAt: '2024-01-15T09:30:00',
    student: { name: 'Максим Иванов', rating: 4.8 },
    service: {
      price: 220000,
      subject: { name: 'Математика' },
      teacher: { fullName: 'Подготовка к ЕГЭ' },
    },
  },
  {
    id: '3',
    studentId: 'student-3',
    serviceId: 'service-1',
    message: 'Мне нужна интенсивная подготовка к ЕГЭ, до экзамена осталось 3 месяца.',
    price: 250000,
    proposedDeadline: '2024-01-25T19:00:00',
    status: 'PENDING',
    createdAt: '2024-01-13T18:45:00',
    updatedAt: '2024-01-13T18:45:00',
    student: { name: 'Дмитрий Волков', rating: 4.6 },
    service: {
      price: 220000,
      subject: { name: 'Математика' },
      teacher: { fullName: 'Подготовка к ЕГЭ' },
    },
  },
]

export function useServiceResponses() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()

  const serviceId = ref(Number(route.params.id))
  const activeTab = ref<ResponseTabId>('new')
  const service = ref<ServiceInfo>(MOCK_SERVICE)
  const responses = ref<ServiceResponseItem[]>([...MOCK_RESPONSES])

  const filteredResponses = computed(() => {
    switch (activeTab.value) {
      case 'new':
        return responses.value.filter((r) => r.status === 'PENDING')
      case 'active':
        return responses.value.filter((r) => r.status === 'ACCEPTED')
      case 'completed':
        return responses.value.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED')
      default:
        return responses.value
    }
  })

  const pendingCount = computed(() => responses.value.filter((r) => r.status === 'PENDING').length)
  const activeCount = computed(() => responses.value.filter((r) => r.status === 'ACCEPTED').length)
  const completedCount = computed(
    () => responses.value.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED').length,
  )

  function goBack() {
    telegramStore.hapticFeedback('light')
    router.back()
  }

  function acceptResponse(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('medium')
    response.status = 'ACCEPTED'
    response.updatedAt = new Date().toISOString()
  }

  function rejectResponse(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('heavy')
    response.status = 'REJECTED'
    response.updatedAt = new Date().toISOString()
  }

  function contactStudent(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('light')
  }

  function completeLessons(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('light')
    response.status = 'REJECTED' // placeholder: would be a separate "completed" state in API
  }

  onMounted(() => {
    // TODO: load service and responses by serviceId
  })

  return {
    serviceId,
    activeTab,
    service,
    responses,
    filteredResponses,
    pendingCount,
    activeCount,
    completedCount,
    goBack,
    acceptResponse,
    rejectResponse,
    contactStudent,
    completeLessons,
    getResponseStatusInfo,
    formatDate: formatResponseDate,
    formatDeadline: formatResponseDeadline,
  }
}
