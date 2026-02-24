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
  deadline: string | null
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
