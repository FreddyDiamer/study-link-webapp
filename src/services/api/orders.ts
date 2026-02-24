import { apiClient } from './client'
import type {
  Request,
  Deal,
  ServiceResponse,
  RequestResponse,
  CreateRequestDto,
  UpdateRequestDto,
  CreateServiceResponseDto,
  CreateRequestResponseDto,
  PaginatedResponse,
} from '@/shared/types'

export const ordersApi = {
  // =============================================================================
  // REQUESTS (Заявки студентов)
  // =============================================================================

  // Получить все заявки
  getRequests: (params?: any) =>
    apiClient.get<PaginatedResponse<Request>>('/marketplace/requests', params),

  // Получить мои заявки
  getMyRequests: () => apiClient.get<PaginatedResponse<Request>>('/marketplace/requests/my'),

  // Получить заявку по ID
  getRequest: (id: string) => apiClient.get<Request>(`/marketplace/requests/${id}`),

  // Создать заявку
  createRequest: (data: CreateRequestDto) => apiClient.post<Request>('/marketplace/requests', data),

  // Обновить заявку
  updateRequest: (id: string, data: UpdateRequestDto) =>
    apiClient.patch<Request>(`/marketplace/requests/${id}`, data),

  // Удалить заявку
  deleteRequest: (id: string) => apiClient.delete(`/marketplace/requests/${id}`),

  // =============================================================================
  // DEALS (Сделки)
  // =============================================================================

  // Получить все сделки
  getDeals: (params?: any) => apiClient.get<PaginatedResponse<Deal>>('/marketplace/deals', params),

  // Получить мои сделки как репетитор
  getMyTutorDeals: () => apiClient.get<PaginatedResponse<Deal>>('/marketplace/deals/my-tutor'),

  // Получить сделку по ID
  getDeal: (id: string) => apiClient.get<Deal>(`/marketplace/deals/${id}`),

  // Обновить сделку (статус, цена, дедлайн)
  updateDeal: (id: string, data: Partial<Deal>) =>
    apiClient.patch<Deal>(`/marketplace/deals/${id}`, data),

  // Принять сделку
  acceptDeal: (id: string) => apiClient.patch<Deal>(`/marketplace/deals/${id}/accept`),

  // Отклонить сделку
  rejectDeal: (id: string) => apiClient.patch<Deal>(`/marketplace/deals/${id}/reject`),

  // Завершить сделку
  completeDeal: (id: string) => apiClient.patch<Deal>(`/marketplace/deals/${id}/complete`),

  // Отменить сделку
  cancelDeal: (id: string) => apiClient.patch<Deal>(`/marketplace/deals/${id}/cancel`),

  // =============================================================================
  // SERVICE RESPONSES (Отклики студентов на услуги)
  // =============================================================================

  // Получить отклики на услугу (API возвращает { items, total })
  getServiceResponses: (serviceId: string) =>
    apiClient.get<PaginatedResponse<ServiceResponse>>(
      `/marketplace/service-responses/by-service/${serviceId}`,
    ),

  // Получить мои отклики на услуги
  getMyServiceResponses: () =>
    apiClient.get<PaginatedResponse<ServiceResponse>>('/marketplace/service-responses/my'),

  // Создать отклик на услугу
  createServiceResponse: (data: CreateServiceResponseDto) =>
    apiClient.post<ServiceResponse>('/marketplace/service-responses', data),

  // Обновить отклик на услугу
  updateServiceResponse: (id: string, data: Partial<CreateServiceResponseDto>) =>
    apiClient.patch<ServiceResponse>(`/marketplace/service-responses/${id}`, data),

  // Удалить отклик на услугу
  deleteServiceResponse: (id: string) => apiClient.delete(`/marketplace/service-responses/${id}`),

  // Принять отклик на услугу (репетитор)
  acceptServiceResponse: (id: string) =>
    apiClient.patch<ServiceResponse>(`/marketplace/service-responses/${id}/accept`),

  // Отклонить отклик на услугу (репетитор)
  rejectServiceResponse: (id: string) =>
    apiClient.patch<ServiceResponse>(`/marketplace/service-responses/${id}/reject`),

  // =============================================================================
  // REQUEST RESPONSES (Отклики репетиторов на заявки)
  // =============================================================================

  // Получить отклики на заявку
  getRequestResponses: (requestId: string) =>
    apiClient.get<RequestResponse[]>(`/marketplace/request-responses`, { requestId }),

  // Получить мои отклики на заявки
  getMyRequestResponses: () =>
    apiClient.get<PaginatedResponse<RequestResponse>>('/marketplace/request-responses/my'),

  // Создать отклик на заявку
  createRequestResponse: (data: CreateRequestResponseDto) =>
    apiClient.post<RequestResponse>('/marketplace/request-responses', data),

  // Обновить отклик на заявку
  updateRequestResponse: (id: string, data: Partial<CreateRequestResponseDto>) =>
    apiClient.patch<RequestResponse>(`/marketplace/request-responses/${id}`, data),

  // Принять отклик на заявку (студент)
  acceptRequestResponse: (id: string) =>
    apiClient.patch<RequestResponse>(`/marketplace/request-responses/${id}/accept`),

  // Отклонить отклик на заявку (студент)
  rejectRequestResponse: (id: string) =>
    apiClient.patch<RequestResponse>(`/marketplace/request-responses/${id}/reject`),

  // Отменить принятый отклик (студент)
  cancelRequestResponse: (id: string) =>
    apiClient.patch<RequestResponse>(`/marketplace/request-responses/${id}/cancel`),

  // Удалить отклик на заявку
  deleteRequestResponse: (id: string) => apiClient.delete(`/marketplace/request-responses/${id}`),
}
