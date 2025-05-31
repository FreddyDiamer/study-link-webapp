import { ordersApi, type CreateOrderData, type Order, type OrderResponse } from '@/api/orders'
import { useTelegramStore } from '@/stores/telegram'
import { useAuthStore } from '@/stores/auth'

export class OrderService {
  private telegramStore = useTelegramStore()
  private authStore = useAuthStore()

  /**
   * Создание заказа с валидацией
   */
  async createOrder(data: CreateOrderData) {
    // Валидация данных
    this.validateOrderData(data)

    try {
      const order = await ordersApi.create(data)

      // Тактильная обратная связь
      this.telegramStore.hapticFeedback('medium')

      // Показываем уведомление
      this.showNotification('Заказ успешно создан')

      return order
    } catch (error: any) {
      console.error('Ошибка создания заказа:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение заказов студента
   */
  async getStudentOrders() {
    const user = this.authStore.user
    if (!user || !this.authStore.isStudent) {
      throw new Error('Пользователь не является студентом')
    }

    try {
      return await ordersApi.getStudentOrders(user.id)
    } catch (error: any) {
      console.error('Ошибка получения заказов студента:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение заказов репетитора
   */
  async getTutorOrders() {
    const user = this.authStore.user
    if (!user || !this.authStore.isTutor) {
      throw new Error('Пользователь не является репетитором')
    }

    try {
      return await ordersApi.getTutorOrders(user.id)
    } catch (error: any) {
      console.error('Ошибка получения заказов репетитора:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение откликов на заказ
   */
  async getOrderResponses(orderId: string) {
    if (!orderId) {
      throw new Error('ID заказа обязателен')
    }

    try {
      return await ordersApi.getResponses(orderId)
    } catch (error: any) {
      console.error('Ошибка получения откликов:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Отклик на заказ (репетитор)
   */
  async respondToOrder(orderId: string, message: string, price: number) {
    if (!orderId || !message.trim() || price <= 0) {
      throw new Error('Все поля обязательны для заполнения')
    }

    if (!this.authStore.isTutor) {
      throw new Error('Только репетиторы могут откликаться на заказы')
    }

    try {
      const response = await ordersApi.respond(orderId, { message, price })

      this.telegramStore.hapticFeedback('medium')
      this.showNotification('Отклик отправлен')

      return response
    } catch (error: any) {
      console.error('Ошибка отправки отклика:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Принятие отклика (студент)
   */
  async acceptResponse(orderId: string, responseId: string) {
    if (!orderId || !responseId) {
      throw new Error('ID заказа и отклика обязательны')
    }

    if (!this.authStore.isStudent) {
      throw new Error('Только студенты могут принимать отклики')
    }

    try {
      await ordersApi.acceptResponse(orderId, responseId)

      this.telegramStore.hapticFeedback('medium')
      this.showNotification('Отклик принят')

      return true
    } catch (error: any) {
      console.error('Ошибка принятия отклика:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Отклонение отклика (студент)
   */
  async declineResponse(orderId: string, responseId: string) {
    if (!orderId || !responseId) {
      throw new Error('ID заказа и отклика обязательны')
    }

    if (!this.authStore.isStudent) {
      throw new Error('Только студенты могут отклонять отклики')
    }

    try {
      await ordersApi.declineResponse(orderId, responseId)

      this.telegramStore.hapticFeedback('medium')
      this.showNotification('Отклик отклонен')

      return true
    } catch (error: any) {
      console.error('Ошибка отклонения отклика:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Отмена заказа
   */
  async cancelOrder(orderId: string) {
    if (!orderId) {
      throw new Error('ID заказа обязателен')
    }

    try {
      const order = await ordersApi.cancel(orderId)

      this.telegramStore.hapticFeedback('heavy')
      this.showNotification('Заказ отменен')

      return order
    } catch (error: any) {
      console.error('Ошибка отмены заказа:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Пометить отклик как прочитанный
   */
  async markResponseAsRead(orderId: string, responseId: string) {
    if (!orderId || !responseId) {
      throw new Error('ID заказа и отклика обязательны')
    }

    try {
      await ordersApi.markResponseAsRead(orderId, responseId)
      return true
    } catch (error: any) {
      console.error('Ошибка пометки отклика как прочитанного:', error)
      // Не показываем ошибку пользователю для этой операции
      return false
    }
  }

  /**
   * Валидация данных заказа
   */
  private validateOrderData(data: CreateOrderData) {
    if (!data.subject?.trim()) {
      throw new Error('Предмет обязателен')
    }

    if (!data.description?.trim()) {
      throw new Error('Описание обязательно')
    }

    if (data.description.length < 10) {
      throw new Error('Описание должно содержать минимум 10 символов')
    }

    if (!data.budget || data.budget <= 0) {
      throw new Error('Бюджет должен быть больше 0')
    }

    if (!data.format?.trim()) {
      throw new Error('Формат обучения обязателен')
    }

    if (!data.schedule?.trim()) {
      throw new Error('Расписание обязательно')
    }
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
      return 'Заказ не найден'
    }
    if (error.response?.status === 403) {
      return 'Недостаточно прав для выполнения операции'
    }
    if (error.response?.status === 409) {
      return 'Конфликт данных. Возможно, заказ уже обработан'
    }
    if (error.response?.status >= 500) {
      return 'Проблемы на сервере. Попробуйте позже'
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    return 'Произошла ошибка при работе с заказами'
  }
}

// Создаем единственный экземпляр
export const orderService = new OrderService()
