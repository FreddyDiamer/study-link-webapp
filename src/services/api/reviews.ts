import { apiClient } from './client'
import type { Review, CreateReviewDto, Reputation } from '@/shared/types'

export const reviewsApi = {
  // Получить отзывы о пользователе (бэкенд отдаёт { items, total })
  getUserReviews: (userId: string) =>
    apiClient.get<{ items: Review[]; total: number }>(`/reviews/by-target/${userId}`),

  // Две репутации пользователя: как исполнителя и как заказчика
  getReputation: (userId: string) => apiClient.get<Reputation>(`/reviews/reputation/${userId}`),

  // Создать отзыв
  createReview: (data: CreateReviewDto) => apiClient.post<Review>('/reviews', data),
}
