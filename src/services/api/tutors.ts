import { apiClient } from './client'
import type {
  Service,
  ServiceFilterDto,
  CreateServiceDto,
  UpdateServiceDto,
  PaginatedResponse,
  Tutor,
} from '@/shared/types'

export const tutorsApi = {
  // Получить репетитора по ID
  getById: (id: string) => apiClient.get<Tutor>(`/tutors/${id}`),

  // Получить предметы
  getSubjects: () => apiClient.get('/education/subjects'),

  // Получить все услуги с фильтрацией
  getServices: (params?: ServiceFilterDto) =>
    apiClient.get<PaginatedResponse<Service>>('/marketplace/services', params),

  // Получить активные услуги
  getActiveServices: () =>
    apiClient.get<PaginatedResponse<Service>>('/marketplace/services/active'),

  // Получить мои услуги
  getMyServices: () => apiClient.get<PaginatedResponse<Service>>('/marketplace/services/my'),

  // Получить услуги конкретного репетитора
  getServicesByTutor: (tutorId: string) =>
    apiClient.get<PaginatedResponse<Service>>(`/marketplace/services/by-tutor/${tutorId}`),

  // Получить услуги по предмету и преподавателю
  getServicesBySubjectAndTeacher: (subjectId: string, teacherId: string) =>
    apiClient.get<PaginatedResponse<Service>>(
      `/marketplace/services/by-subject-teacher/${subjectId}/${teacherId}`,
    ),

  // Получить услугу по ID
  getService: (id: string) => apiClient.get<Service>(`/marketplace/services/${id}`),

  // Получить статистику услуги
  getServiceStats: (id: string) => apiClient.get(`/marketplace/services/${id}/stats`),

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
