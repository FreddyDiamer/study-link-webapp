import { apiClient } from './client'
import type { Review, CreateReviewDto, Reputation } from '@/shared/types'

export const reviewsApi = {
  // Получить отзывы о пользователе (бэкенд отдаёт { items, total })
  getUserReviews: (userId: string) =>
    apiClient.get<{ items: Review[]; total: number }>(`/reviews/by-target/${userId}`),

  // Две репутации пользователя: как исполнителя и как заказчика
  getReputation: (userId: string) => apiClient.get<Reputation>(`/reviews/reputation/${userId}`),

  // Получить отзыв по ID
  getReview: (id: string) => apiClient.get<Review>(`/reviews/${id}`),

  // Создать отзыв
  createReview: (data: CreateReviewDto) => apiClient.post<Review>('/reviews', data),

  // Обновить отзыв
  updateReview: (id: string, data: Partial<CreateReviewDto>) =>
    apiClient.patch<Review>(`/reviews/${id}`, data),

  // Удалить отзыв
  deleteReview: (id: string) => apiClient.delete(`/reviews/${id}`),

  // Получить отзывы по сделке
  getDealReviews: (dealId: string) => apiClient.get<Review[]>(`/reviews/deal/${dealId}`),
}
