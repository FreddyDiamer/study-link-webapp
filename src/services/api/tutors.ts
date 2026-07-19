import { apiClient } from './client'
import type {
  Service,
  ServiceFilterDto,
  CreateServiceDto,
  UpdateServiceDto,
  PaginatedResponse,
  Tutor,
  TutorSearchParams,
} from '@/shared/types'

export const tutorsApi = {
  // Поиск репетиторов
  search: (params: TutorSearchParams) =>
    apiClient.get<PaginatedResponse<Tutor>>('/tutors/search', params),

  // Удалить из избранного
  removeFromFavorites: (tutorId: string) => apiClient.delete(`/tutors/${tutorId}/favorites`),

  // Получить избранных репетиторов
  getFavorites: () => apiClient.get<PaginatedResponse<Tutor>>('/tutors/favorites'),

  // Получить статистику репетитора
  getTutorStats: () =>
    apiClient.get<{
      totalStudents: number
      totalReviews: number
      averageRating: number
      activeServices: number
      monthlyRequests: number
    }>('/tutors/stats'),

  // Получить все услуги с фильтрацией
  getServices: (params?: ServiceFilterDto) =>
    apiClient.get<PaginatedResponse<Service>>('/marketplace/services', params),

  // Получить активные услуги
  getActiveServices: () =>
    apiClient.get<PaginatedResponse<Service>>('/marketplace/services/active'),

  // Получить популярные услуги
  getPopularServices: (limit?: number) =>
    apiClient.get<PaginatedResponse<Service>>('/marketplace/services/popular', { limit }),

  // Получить мои услуги
  getMyServices: () => apiClient.get<PaginatedResponse<Service>>('/marketplace/services/my'),

  // Получить услугу по ID
  getService: (id: string) => apiClient.get<Service>(`/marketplace/services/${id}`),

  // Создать услугу
  createService: (data: CreateServiceDto) => apiClient.post<Service>('/marketplace/services', data),

  // Обновить услугу
  updateService: (id: string, data: UpdateServiceDto) =>
    apiClient.patch<Service>(`/marketplace/services/${id}`, data),

  // Активировать услугу
  activateService: (id: string) => apiClient.patch<Service>(`/marketplace/services/${id}/activate`),

  // Деактивировать услугу
  deactivateService: (id: string) =>
    apiClient.patch<Service>(`/marketplace/services/${id}/deactivate`),

  // Удалить услугу
  deleteService: (id: string) => apiClient.delete(`/marketplace/services/${id}`),
}
