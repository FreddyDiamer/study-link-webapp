import { tutorsApi } from '@/services/api/tutors'
import { useTelegramStore } from '@/stores/telegram'
import type { TutorSearchParams, Tutor } from '@/shared/types'

export class TutorService {
  private get telegramStore() {
    return useTelegramStore()
  }

  /**
   * Поиск репетиторов с валидацией и кешированием
   */
  async searchTutors(params: TutorSearchParams) {
    // Валидация параметров
    if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
      throw new Error('Минимальная цена не может быть больше максимальной')
    }

    if (params.minRating && (params.minRating < 0 || params.minRating > 5)) {
      throw new Error('Рейтинг должен быть от 0 до 5')
    }

    try {
      const response = await tutorsApi.search(params)

      // Логируем для аналитики
      this.logSearchEvent(params, response.total)

      return response
    } catch (error: any) {
      console.error('Ошибка поиска репетиторов:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Удаление из избранного
   */
  async removeFromFavorites(tutorId: string) {
    if (!tutorId) {
      throw new Error('ID репетитора обязателен')
    }

    try {
      this.telegramStore.hapticFeedback('light')

      await tutorsApi.removeFromFavorites(tutorId)

      this.showNotification('Репетитор удален из избранного')

      return true
    } catch (error: any) {
      console.error('Ошибка удаления из избранного:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение избранных репетиторов
   */
  async getFavorites() {
    try {
      return await tutorsApi.getFavorites()
    } catch (error: any) {
      console.error('Ошибка получения избранных:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение статистики репетитора
   */
  async getStats() {
    try {
      return await tutorsApi.getTutorStats()
    } catch (error: any) {
      console.error('Ошибка получения статистики репетитора:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Логирование события поиска для аналитики
   */
  private logSearchEvent(params: TutorSearchParams, resultsCount: number) {
    // В реальном приложении здесь была бы отправка в аналитику
    console.log('Search event:', {
      subject: params.subject,
      search: params.search,
      resultsCount,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Показ уведомления пользователю
   */
  private showNotification(message: string) {
    // В реальном приложении здесь был бы toast или другое уведомление
    console.log('Notification:', message)
  }

  /**
   * Получение понятного сообщения об ошибке
   */
  private getErrorMessage(error: any): string {
    if (error.response?.status === 404) {
      return 'Репетитор не найден'
    }
    if (error.response?.status === 403) {
      return 'Недостаточно прав для выполнения операции'
    }
    if (error.response?.status >= 500) {
      return 'Проблемы на сервере. Попробуйте позже'
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    return 'Произошла ошибка при работе с репетиторами'
  }
}

// Создаем единственный экземпляр
export const tutorService = new TutorService()
