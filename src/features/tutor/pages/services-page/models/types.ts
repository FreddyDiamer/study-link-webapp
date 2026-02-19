export type TutorServicesTab = 'services' | 'responses' | 'deals'

export type ServiceStatus = 'active' | 'frozen' | 'deleted'

export interface TutorServiceCard {
  id: number
  title: string
  subject: string
  teacher: string
  level: string
  description: string
  price: number
  duration: number
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
