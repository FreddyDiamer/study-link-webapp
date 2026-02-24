import { apiClient } from './client'
import type { Review, CreateReviewDto } from '@/shared/types'

export interface ReviewsListResponse {
  items: Review[]
  total: number
}

export const reviewsApi = {
  // Получить отзывы о пользователе (по ID получателя, опционально по роли: TUTOR | STUDENT)
  getByTarget: (targetId: string, targetRole?: 'TUTOR' | 'STUDENT') =>
    apiClient.get<ReviewsListResponse>(`/reviews/by-target/${targetId}`, {
      targetRole,
    } as Record<string, string>),

  // Получить отзывы пользователя (алиас для getByTarget)
  getUserReviews: (userId: string, targetRole?: 'TUTOR' | 'STUDENT') =>
    reviewsApi.getByTarget(userId, targetRole).then((res) => res.items),

  // Отзывы обо мне (текущий пользователь, опционально по роли)
  getAboutMe: (targetRole?: 'TUTOR' | 'STUDENT') =>
    apiClient.get<ReviewsListResponse>('/reviews/about-me', {
      targetRole,
    } as Record<string, string>),

  // Мои отзывы (написанные мной)
  getMy: () => apiClient.get<ReviewsListResponse>('/reviews/my'),

  // Статистика отзывов пользователя (опционально по роли)
  getTargetStats: (targetId: string, targetRole?: 'TUTOR' | 'STUDENT') =>
    apiClient.get<{
      totalReviews: number
      averageRating: number
      ratingDistribution: Record<number, number>
      recentReviews: Array<{ rating: number; createdAt: string }>
    }>(`/reviews/stats/${targetId}`, {
      targetRole,
    } as Record<string, string>),

  // Получить отзыв по ID
  getReview: (id: string) => apiClient.get<Review>(`/reviews/${id}`),

  // Создать отзыв
  createReview: (data: CreateReviewDto) => apiClient.post<Review>('/reviews', data),

  // Обновить отзыв
  updateReview: (id: string, data: Partial<CreateReviewDto>) =>
    apiClient.patch<Review>(`/reviews/${id}`, data),

  // Удалить отзыв
  deleteReview: (id: string) => apiClient.delete(`/reviews/${id}`),

  // Ответить на отзыв / изменить / удалить ответ (репетитор)
  setReviewReply: (id: string, reply: string | null) =>
    apiClient.patch<Review>(`/reviews/${id}/reply`, { reply }),

  // Получить отзывы по сделке
  getDealReviews: (dealId: string) => apiClient.get<Review[]>(`/reviews/deal/${dealId}`),
}
