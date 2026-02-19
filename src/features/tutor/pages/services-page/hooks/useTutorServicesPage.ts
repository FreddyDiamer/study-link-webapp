import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'
import type {
  TutorServicesTab,
  TutorServiceCard,
  TutorActiveDeal,
  TutorRequestResponse,
} from '../models'

const MOCK_SERVICES: TutorServiceCard[] = [
  {
    id: 1,
    title: 'Подготовка к ЕГЭ по математике',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'ЕГЭ',
    description:
      'Комплексная подготовка к ЕГЭ по математике профильного уровня. Разбор всех типов заданий, работа с ошибками, решение вариантов.',
    price: 2200,
    duration: 90,
    format: ['Онлайн', 'Очно'],
    status: 'active',
    studentsCount: 15,
    rating: 4.9,
    reviewsCount: 43,
    responsesCount: 12,
    newResponsesCount: 3,
    activeResponsesCount: 8,
    hasActiveDeals: true,
    features: [
      'Индивидуальный план подготовки',
      'Домашние задания с проверкой',
      'Пробные тесты ЕГЭ',
      'Разбор типичных ошибок',
    ],
  },
  {
    id: 2,
    title: 'Алгебра для 8-9 классов',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'ОГЭ',
    description:
      'Помощь с изучением алгебры в 8-9 классах, подготовка к ОГЭ. Работа с уравнениями, неравенствами, функциями.',
    price: 1800,
    duration: 60,
    format: ['Онлайн'],
    status: 'frozen',
    studentsCount: 8,
    rating: 4.8,
    reviewsCount: 21,
    responsesCount: 5,
    newResponsesCount: 0,
    activeResponsesCount: 2,
    hasActiveDeals: false,
    features: [
      'Объяснение сложных тем',
      'Практические задания',
      'Подготовка к контрольным',
      'Регулярная обратная связь',
    ],
  },
  {
    id: 3,
    title: 'Геометрия с нуля',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'Школьная программа',
    description:
      'Изучение геометрии с основ. Подходит для учеников 7-11 классов, которые хотят разобраться в предмете.',
    price: 2000,
    duration: 75,
    format: ['Очно'],
    status: 'active',
    studentsCount: 3,
    rating: 4.7,
    reviewsCount: 12,
    responsesCount: 8,
    newResponsesCount: 1,
    activeResponsesCount: 4,
    hasActiveDeals: false,
    features: [
      'Основы планиметрии',
      'Стереометрия',
      'Решение задач разной сложности',
      'Визуализация теорем',
    ],
  },
  {
    id: 4,
    title: 'Олимпиадная математика',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'Олимпиады',
    description:
      'Подготовка к математическим олимпиадам различного уровня. Нестандартные задачи, развитие логического мышления.',
    price: 3000,
    duration: 120,
    format: ['Онлайн', 'Очно'],
    status: 'deleted',
    studentsCount: 5,
    rating: 5.0,
    reviewsCount: 8,
    responsesCount: 2,
    newResponsesCount: 0,
    activeResponsesCount: 0,
    hasActiveDeals: false,
    features: [
      'Нестандартные задачи',
      'Развитие логики',
      'Подготовка к конкурсам',
      'Индивидуальный подход',
    ],
  },
]

const MOCK_DEALS: TutorActiveDeal[] = [
  {
    id: 1,
    studentId: 'student3',
    studentName: 'София Иванова',
    serviceTitle: 'Геометрия с нуля',
    subject: 'Математика',
    teacher: 'Иванов Петр Сергеевич',
    taskDescription:
      'Совсем не понимаю геометрию, нужна помощь с основами. Особенно сложно с теоремами и доказательствами.',
    tutorComment:
      'Готов помочь разобраться с геометрией пошагово. Начнем с основных понятий и постепенно перейдем к более сложным темам.',
    price: 2000,
    deadline: new Date('2024-03-15'),
    status: 'in_progress',
    createdAt: new Date('2024-01-13T12:00:00'),
    lastActivity: new Date('2024-01-20T16:30:00'),
  },
  {
    id: 2,
    studentId: 'student4',
    studentName: 'Алексей Кузнецов',
    serviceTitle: 'Алгебра для 8-9 классов',
    subject: 'Математика',
    teacher: 'Смирнова Анна Владимировна',
    taskDescription:
      'Нужна подготовка к ОГЭ по алгебре. Сложности с решением уравнений и неравенств.',
    tutorComment: 'Занятия будут включать разбор типовых заданий ОГЭ и практические упражнения.',
    price: 1800,
    deadline: new Date('2024-02-28'),
    status: 'accepted',
    createdAt: new Date('2024-01-10T14:20:00'),
    lastActivity: new Date('2024-01-19T10:15:00'),
  },
]

const MOCK_RESPONSES: TutorRequestResponse[] = [
  {
    id: 1,
    tutorId: 'current-tutor',
    requestId: 1,
    studentName: 'Анна Смирнова',
    requestTitle: 'Подготовка к ЕГЭ по математике',
    requestDescription:
      'Нужна помощь с подготовкой к ЕГЭ по математике, особенно с алгеброй и геометрией.',
    message:
      'Здравствуйте! Готов помочь с подготовкой к ЕГЭ. У меня большой опыт подготовки учеников к экзаменам.',
    price: 2200,
    proposedDeadline: new Date('2024-05-15'),
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    budget: 2500,
    urgency: 'high',
  },
  {
    id: 2,
    tutorId: 'current-tutor',
    requestId: 2,
    studentName: 'Михаил Петров',
    requestTitle: 'Алгебра 9 класс',
    requestDescription: 'Помощь с алгеброй в 9 классе, подготовка к ОГЭ.',
    message: 'Могу помочь с алгеброй и подготовкой к ОГЭ. Предлагаю индивидуальный подход.',
    price: 1800,
    proposedDeadline: new Date('2024-04-20'),
    status: 'accepted',
    createdAt: new Date('2024-01-14T15:20:00'),
    budget: 2000,
    urgency: 'medium',
  },
  {
    id: 3,
    tutorId: 'current-tutor',
    requestId: 3,
    studentName: 'София Иванова',
    requestTitle: 'Геометрия с нуля',
    requestDescription: 'Совсем не понимаю геометрию, нужна помощь с основами.',
    message: 'Специализируюсь на объяснении геометрии с нуля. Использую наглядные методы.',
    price: 2000,
    proposedDeadline: undefined,
    status: 'rejected',
    createdAt: new Date('2024-01-13T09:15:00'),
    budget: 1800,
    urgency: 'low',
  },
]

export function useTutorServicesPage() {
  const router = useRouter()
  const telegramStore = useTelegramStore()

  const activeTab = ref<TutorServicesTab>('services')
  const services = ref<TutorServiceCard[]>([...MOCK_SERVICES])
  const activeDeals = ref<TutorActiveDeal[]>([...MOCK_DEALS])
  const requestResponses = ref<TutorRequestResponse[]>([...MOCK_RESPONSES])

  const activeServices = computed(() =>
    services.value.filter((s) => s.status !== 'deleted'),
  )

  const pendingResponsesCount = computed(
    () => requestResponses.value.filter((r) => r.status === 'pending').length,
  )
  const activeDealsCount = computed(
    () =>
      activeDeals.value.filter(
        (d) => d.status === 'in_progress' || d.status === 'accepted',
      ).length,
  )

  function createService() {
    telegramStore.hapticFeedback('light')
    router.push(PATHS.TUTOR_CREATE_SERVICE)
  }

  function viewService(service: TutorServiceCard) {
    if (service.status === 'deleted') return
    telegramStore.hapticFeedback('light')
    router.push(`/tutor/services/${service.id}/responses`)
  }

  function editService(service: TutorServiceCard) {
    telegramStore.hapticFeedback('light')
    router.push(`/tutor/services/${service.id}/edit`)
  }

  function viewDealDetails(deal: TutorActiveDeal) {
    telegramStore.hapticFeedback('light')
  }

  function completeDeal(deal: TutorActiveDeal) {
    telegramStore.hapticFeedback('medium')
    deal.status = 'completed'
  }

  function withdrawResponse(response: TutorRequestResponse) {
    telegramStore.hapticFeedback('medium')
  }

  function switchTab(tab: TutorServicesTab) {
    telegramStore.hapticFeedback('light')
    activeTab.value = tab
  }

  return {
    activeTab,
    services,
    activeDeals,
    requestResponses,
    activeServices,
    pendingResponsesCount,
    activeDealsCount,
    createService,
    viewService,
    editService,
    viewDealDetails,
    completeDeal,
    withdrawResponse,
    switchTab,
  }
}
