export type TutorServicesTab = 'services' | 'responses' | 'deals' | 'deals-completed'

export type ServiceStatus = 'active' | 'frozen' | 'deleted'

export interface TutorServiceCard {
  id: number
  originalId: string // Оригинальный строковый ID с бэка для навигации
  title: string
  subject: string
  teacher: string
  level: string
  description: string
  price: number
  /** Количество занятий для подготовки студента */
  lessonsCount: number
  /** Длительность одного занятия в минутах */
  lessonDurationMinutes: number
  duration: number // дублирует lessonDurationMinutes для совместимости
  format: string[]
  status: ServiceStatus
  studentsCount: number
  rating: number
  reviewsCount: number
  features: string[]
  responsesCount: number
  newResponsesCount: number
  activeResponsesCount: number
  hasActiveDeals: boolean
}

export interface TutorActiveDeal {
  id: number
  originalId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  serviceTitle: string
  subject: string
  teacher: string
  taskDescription: string
  tutorComment?: string
  price: number
  deadline?: Date
  status: 'pending' | 'accepted' | 'in_progress' | 'completed'
  createdAt: Date
  lastActivity: Date
}

export interface TutorRequestResponse {
  id: number
  originalId: string // UUID отклика для API (удаление и т.д.)
  tutorId: string
  requestId: number
  studentName: string
  studentAvatar?: string
  requestTitle: string
  requestDescription: string
  message?: string
  price?: number
  proposedDeadline?: Date
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  budget?: number
  urgency?: 'low' | 'medium' | 'high'
}
