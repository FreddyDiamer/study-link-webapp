// =============================================================================
// CORE TYPES
// =============================================================================

export interface User {
  id: string
  telegramUsername: string
  telegramId: string
  name: string
  firstName?: string
  description?: string
  avatarUrl?: string
  groupId?: string
  group?: Group
  balance: number // в копейках
  lastActivity: string
  createdAt: string
  updatedAt: string
  /** рейтинг приходит не во всех выдачах — источник истины в /reviews/reputation */
  rating?: number
  reviewsCount?: number
}

export interface Tutor extends User {
  rating: number
  reviewsCount: number
  subjects: Subject[]
  isFavorite?: boolean
}

export interface TutorSearchParams {
  search?: string
  subject?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  page?: number
  limit?: number
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    telegramUsername: string
    name: string
  }
}

// =============================================================================
// EDUCATION DOMAIN
// =============================================================================

export interface Subject {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: string
  fullName: string
  foreignId: string
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: string
  number: string
  createdAt: string
  updatedAt: string
}

export interface TeacherSubject {
  id: string
  teacherId: string
  subjectId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  teacher: Teacher
  subject: Subject
}

// =============================================================================
// MARKETPLACE DOMAIN
// =============================================================================

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum DealStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ResponseStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface Service {
  id: string
  tutorId: string
  subjectId: string
  teacherId: string
  price: number // в копейках
  description?: string
  status: ServiceStatus
  deadline?: string
  createdAt: string
  updatedAt: string
  tutor: User
  subject: Subject
  teacher: Teacher
  responses?: ServiceResponse[]
}

export interface Request {
  id: string
  studentId: string
  subjectId: string
  teacherId: string
  description?: string
  budget?: number // в копейках
  deadline?: string
  createdAt: string
  updatedAt: string
  student: User
  subject: Subject
  teacher: Teacher
  responses?: RequestResponse[]
}

export interface Deal {
  id: string
  studentId: string
  tutorId: string
  subjectId: string
  teacherId: string
  price: number // в копейках
  deadline?: string
  status: DealStatus
  // подтверждение выполнения каждой стороной; сделка закрывается по обоим
  studentConfirmedAt?: string | null
  tutorConfirmedAt?: string | null
  /** когда сделка закроется без второй стороны; считает бэкенд */
  autoConfirmAt?: string | null
  // отмена: кто, когда и почему — видно обеим сторонам
  cancelledAt?: string | null
  cancelledById?: string | null
  cancelReason?: string | null
  serviceResponseId?: string
  requestResponseId?: string
  createdAt: string
  updatedAt: string
  student: User
  tutor: User
  subject: Subject
  teacher: Teacher
  reviews?: Review[]
  serviceResponse?: ServiceResponse
  requestResponse?: RequestResponse
  review?: Review
}

export interface ServiceResponse {
  id: string
  studentId: string
  serviceId: string
  message?: string
  price?: number // предложенная цена студента
  proposedDeadline?: string
  status: ResponseStatus
  createdAt: string
  updatedAt: string
  student: User
  service: Service
  deal?: Deal
}

export interface RequestResponse {
  id: string
  tutorId: string
  requestId: string
  message?: string
  price?: number // предложенная цена репетитора
  proposedDeadline?: string
  status: ResponseStatus
  createdAt: string
  updatedAt: string
  tutor: User
  request: Request
  deal?: Deal
}

// =============================================================================
// FEEDBACK SYSTEM
// =============================================================================

export enum UserRole {
  TUTOR = 'TUTOR',
  STUDENT = 'STUDENT',
}

export interface Review {
  id: string
  dealId: string
  authorId: string
  targetId: string
  rating: number // 1-5
  comment?: string
  targetRole: UserRole
  createdAt: string
  updatedAt: string
  deal: Deal
  author: User
  target: User
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// =============================================================================
// DTO TYPES
// =============================================================================

export interface CreateServiceDto {
  subjectId: string
  teacherId: string
  price: number
  description?: string
  deadline?: string
}

export interface UpdateServiceDto {
  price?: number
  description?: string
  status?: ServiceStatus
  deadline?: string
}

export interface ServiceFilterDto {
  subjectId?: string
  teacherId?: string
  minPrice?: number
  maxPrice?: number
  status?: ServiceStatus
  tutorId?: string
}

export interface CreateRequestDto {
  studentId: string
  subjectId: string
  teacherId: string
  description?: string
  budget?: number
  deadline?: string
}

export interface UpdateRequestDto {
  description?: string
  budget?: number
  deadline?: string
}

export interface CreateServiceResponseDto {
  studentId: string
  serviceId: string
  message?: string
  price?: number
  proposedDeadline?: string
}

export interface CreateRequestResponseDto {
  tutorId: string
  requestId: string
  message?: string
  price?: number
  proposedDeadline?: string
}

export interface CreateReviewDto {
  // автор, получатель и его роль выводятся на сервере из сделки
  dealId: string
  rating: number
  comment?: string
}

/** Средний рейтинг и число отзывов в одной роли. */
export interface RoleReputation {
  rating: number
  count: number
}

/** Две репутации пользователя: как исполнителя и как заказчика. */
export interface Reputation {
  tutor: RoleReputation
  student: RoleReputation
}

// =============================================================================
// TELEGRAM TYPES
// =============================================================================

export interface TelegramAuthDto {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type PriceInRubles = number
export type PriceInKopeks = number
