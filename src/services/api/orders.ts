import { apiClient } from './client'

export interface Order {
  id: string
  studentId: string
  tutorId?: string
  subject: string
  description: string
  budget: number
  format: string
  urgency: 'normal' | 'urgent'
  schedule: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  responsesCount?: number
  newResponsesCount?: number
}

export interface OrderResponse {
  id: string
  orderId: string
  tutorId: string
  tutor: {
    name: string
    avatar: string
    rating: number
    experience: number
    education: string
  }
  message: string
  price: number
  isRead: boolean
  respondedAt: string
  status: 'pending' | 'accepted' | 'declined'
}

export interface CreateOrderData {
  subject: string
  description: string
  budget: number
  format: string
  urgency: 'normal' | 'urgent'
  schedule: string
  tutorId?: string
}

export const ordersApi = {
  // Получение заказов студента
  getStudentOrders: (studentId: string) => apiClient.get<Order[]>(`/students/${studentId}/orders`),

  // Получение заказов репетитора
  getTutorOrders: (tutorId: string) => apiClient.get<Order[]>(`/tutors/${tutorId}/orders`),

  // Создание заказа
  create: (data: CreateOrderData) => apiClient.post<Order>('/orders', data),

  // Получение заказа по ID
  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),

  // Обновление заказа
  update: (id: string, data: Partial<Order>) => apiClient.patch<Order>(`/orders/${id}`, data),

  // Отмена заказа
  cancel: (id: string) => apiClient.patch<Order>(`/orders/${id}/cancel`),

  // Получение откликов на заказ
  getResponses: (orderId: string) => apiClient.get<OrderResponse[]>(`/orders/${orderId}/responses`),

  // Отклик на заказ (репетитор)
  respond: (orderId: string, data: { message: string; price: number }) =>
    apiClient.post<OrderResponse>(`/orders/${orderId}/responses`, data),

  // Принятие отклика (студент)
  acceptResponse: (orderId: string, responseId: string) =>
    apiClient.patch(`/orders/${orderId}/responses/${responseId}/accept`),

  // Отклонение отклика (студент)
  declineResponse: (orderId: string, responseId: string) =>
    apiClient.patch(`/orders/${orderId}/responses/${responseId}/decline`),

  // Пометить отклик как прочитанный
  markResponseAsRead: (orderId: string, responseId: string) =>
    apiClient.patch(`/orders/${orderId}/responses/${responseId}/read`),
}
