export type ResponseTabId = 'new' | 'active' | 'completed'

export type ResponseStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'

export interface ServiceInfo {
  id: string
  tutorId: string
  subjectId: string
  teacherId: string
  price: number
  description: string
  workingHours: string
  status: string
  lessonsCount: number
  lessonDurationMinutes: number
  createdAt: string
  updatedAt: string
  subject: { name: string }
  teacher: { fullName: string }
}

export interface ResponseStudent {
  name: string
  rating: number
  telegramUsername?: string
}

export interface ResponseServiceRef {
  price: number
  subject: { name: string }
  teacher: { fullName: string }
}

export interface ServiceResponseItem {
  id: string
  studentId: string
  serviceId: string
  message: string
  price: number
  proposedDeadline: string | null
  // Тип дедлайна (today/week/month/custom), чтобы понимать "в течение месяца" и т.п.
  proposedDeadlineType?: string
  // Тип бюджета/ценового ожидания (service-price/flexible/lower/higher)
  budgetType?: string
  status: ResponseStatus
  createdAt: string
  updatedAt: string
  student: ResponseStudent
  service: ResponseServiceRef
}

export interface ResponseStatusInfo {
  color: string
  text: string
  textColor: string
}
