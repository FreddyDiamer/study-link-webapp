import { apiClient } from './client'
import type { Review, CreateReviewDto } from '@/shared/types'

export const reviewsApi = {
  // Получить отзывы пользователя
  getUserReviews: (userId: string) => apiClient.get<Review[]>(`/reviews/user/${userId}`),

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
