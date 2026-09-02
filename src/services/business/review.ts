import { reviewsApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type { Review, CreateReviewDto, Reputation } from '@/shared/types'

export class ReviewService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const response = await reviewsApi.getUserReviews(userId)
      return response?.items ?? []
    } catch (error) {
      this.handleError(error, 'Ошибка при получении отзывов пользователя')
      throw error
    }
  }

  async getReputation(userId: string): Promise<Reputation> {
    try {
      return await reviewsApi.getReputation(userId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении репутации')
      throw error
    }
  }

  async getReview(id: string): Promise<Review> {
    try {
      return await reviewsApi.getReview(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении отзыва')
      throw error
    }
  }

  async createReview(data: CreateReviewDto): Promise<Review> {
    try {
      this.validateReviewData(data)

      this.telegramStore.hapticFeedback('light')

      const review = await reviewsApi.createReview(data)

      this.telegramStore.showAlert('Отзыв оставлен!')

      return review
    } catch (error) {
      this.handleError(error, 'Ошибка при создании отзыва')
      throw error
    }
  }

  async updateReview(id: string, data: Partial<CreateReviewDto>): Promise<Review> {
    try {
      this.validateUpdateReviewData(data)

      this.telegramStore.hapticFeedback('light')

      const review = await reviewsApi.updateReview(id, data)

      this.telegramStore.showAlert('Отзыв обновлен!')

      return review
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении отзыва')
      throw error
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await reviewsApi.deleteReview(id)

      this.telegramStore.showAlert('Отзыв удален!')
    } catch (error) {
      this.handleError(error, 'Ошибка при удалении отзыва')
      throw error
    }
  }

  async getDealReviews(dealId: string): Promise<Review[]> {
    try {
      return await reviewsApi.getDealReviews(dealId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении отзывов по сделке')
      throw error
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async getAverageRating(userId: string): Promise<{ average: number; count: number }> {
    try {
      const reviews = await this.getUserReviews(userId)

      if (reviews.length === 0) {
        return { average: 0, count: 0 }
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const average = totalRating / reviews.length

      return {
        average: Math.round(average * 10) / 10, // округляем до 1 знака после запятой
        count: reviews.length,
      }
    } catch (error) {
      this.handleError(error, 'Ошибка при получении среднего рейтинга')
      throw error
    }
  }

  // =============================================================================
  // VALIDATION METHODS
  // =============================================================================

  private validateReviewData(data: CreateReviewDto): void {
    if (!data.dealId) {
      throw new Error('Укажите сделку')
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error('Рейтинг должен быть от 1 до 5')
    }
    if (data.comment && data.comment.length > 1000) {
      throw new Error('Комментарий не должен превышать 1000 символов')
    }
  }

  private validateUpdateReviewData(data: Partial<CreateReviewDto>): void {
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Рейтинг должен быть от 1 до 5')
    }
    if (data.comment && data.comment.length > 1000) {
      throw new Error('Комментарий не должен превышать 1000 символов')
    }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 403) {
      message = 'Недостаточно прав для выполнения операции'
    } else if (error.response?.status === 404) {
      message = 'Отзыв не найден'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const reviewService = new ReviewService()
