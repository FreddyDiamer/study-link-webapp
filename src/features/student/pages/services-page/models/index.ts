import type { SelectOption } from '@/shared/components/ui'

export interface Service {
  id: string
  title: string
  description: string
  price: number
  priceType: 'hour' | 'lesson' | 'month'
  subject: string
  /** Количество занятий для подготовки студента */
  lessonsCount: number
  /** Длительность одного занятия в минутах */
  lessonDurationMinutes: number
  /** Имя репетитора (пользователь) */
  tutorName?: string
  teacher: {
    id: string
    name: string
    experience: number
    rating: number
    reviewsCount: number
  }
  /** ID репетитора (владельца услуги) для перехода в профиль */
  tutorId?: string
  format: 'online' | 'offline' | 'both'
  workingHours: string
  availability: 'available' | 'busy' | 'limited'
  tags: string[]
  /** Дата создания услуги (ISO-строка) */
  createdAt: string
  /** true, если услуга принадлежит текущему пользователю (репетитору) */
  isOwnService?: boolean
  /** true, если текущий пользователь уже оставил заявку на эту услугу */
  currentUserResponded?: boolean
}

export interface ServiceFilters {
  search: string
  subject: string
  teacher: string | null
  availability: 'all' | 'available' | 'busy' | 'limited'
  sortBy: 'price' | 'rating' | 'experience' | 'date'
  sortOrder: 'asc' | 'desc'
}

export const SORT_OPTIONS: SelectOption[] = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price', label: 'По цене' },
  { value: 'experience', label: 'По опыту' },
  { value: 'date', label: 'По дате' },
]

export const SORT_ORDER_OPTIONS: SelectOption[] = [
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
]
