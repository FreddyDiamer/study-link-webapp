// User types
export interface User {
  id: string
  telegramId: number
  username?: string
  firstName: string
  lastName?: string
  role: UserRole
  group?: string
  rating: number
  reviewsCount: number
  balance: number
  createdAt: string
}

export type UserRole = 'student' | 'tutor' | 'both'

// Subject and Teacher types
export interface Subject {
  id: string
  name: string
  code: string
}

export interface Teacher {
  id: string
  name: string
  department: string
}

// Service types
export interface Service {
  id: string
  tutorId: string
  tutor: Pick<User, 'id' | 'firstName' | 'lastName' | 'rating' | 'reviewsCount'>
  subjectId: string
  subject: Subject
  teacherId: string
  teacher: Teacher
  price: number
  description?: string
  format: ServiceFormat[]
  availableTime: string[]
  isActive: boolean
  createdAt: string
}

export type ServiceFormat = 'online' | 'offline' | 'hybrid'

// Order types
export interface Order {
  id: string
  studentId: string
  student: Pick<User, 'id' | 'firstName' | 'lastName'>
  subjectId: string
  subject: Subject
  teacherId: string
  teacher: Teacher
  description?: string
  budget: number
  urgency: OrderUrgency
  status: OrderStatus
  createdAt: string
  deadline?: string
}

export type OrderUrgency = 'today' | 'this_week' | 'not_urgent'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

// API types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Telegram types
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}
