import { ordersApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
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

export class OrderService {
  private get telegramStore() {
    return useTelegramStore()
  }

  // =============================================================================
  // REQUESTS (Заявки студентов)
  // =============================================================================

  async getRequests(params?: any): Promise<PaginatedResponse<Request>> {
    try {
      const response = await ordersApi.getRequests(params)
      return this.normalizeRequestsResponse(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении заявок')
      throw error
    }
  }

  async getMyRequests(): Promise<PaginatedResponse<Request>> {
    try {
      return await ordersApi.getMyRequests()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших заявок')
      throw error
    }
  }

  async getRequest(id: string): Promise<Request> {
    try {
      return await ordersApi.getRequest(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении заявки')
      throw error
    }
  }

  async createRequest(data: CreateRequestDto): Promise<Request> {
    try {
      this.validateRequestData(data)

      this.telegramStore.hapticFeedback('light')

      const request = await ordersApi.createRequest(data)

      this.telegramStore.showAlert('Заявка создана!')

      return request
    } catch (error) {
      this.handleError(error, 'Ошибка при создании заявки')
      throw error
    }
  }

  async updateRequest(id: string, data: UpdateRequestDto): Promise<Request> {
    try {
      this.validateUpdateRequestData(data)

      this.telegramStore.hapticFeedback('light')

      const request = await ordersApi.updateRequest(id, data)

      this.telegramStore.showAlert('Заявка обновлена!')

      return request
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении заявки')
      throw error
    }
  }

  async deleteRequest(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await ordersApi.deleteRequest(id)

      this.telegramStore.showAlert('Заявка удалена!')
    } catch (error) {
      this.handleError(error, 'Ошибка при удалении заявки')
      throw error
    }
  }

  // =============================================================================
  // DEALS (Сделки)
  // =============================================================================

  async getDeals(params?: any): Promise<PaginatedResponse<Deal>> {
    try {
      return await ordersApi.getDeals(params)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении сделок')
      throw error
    }
  }

  async getMyTutorDeals(): Promise<PaginatedResponse<Deal>> {
    try {
      return await ordersApi.getMyTutorDeals()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших сделок как репетитора')
      throw error
    }
  }

  async getDeal(id: string): Promise<Deal> {
    try {
      return await ordersApi.getDeal(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении сделки')
      throw error
    }
  }

  async updateDeal(
    id: string,
    data: Partial<Pick<Deal, 'status' | 'price' | 'deadline'>>,
  ): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('light')
      const deal = await ordersApi.updateDeal(id, data)
      this.telegramStore.showAlert('Сделка обновлена!')
      return deal
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении сделки')
      throw error
    }
  }

  async acceptDeal(id: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('light')

      const deal = await ordersApi.acceptDeal(id)

      this.telegramStore.showAlert('Сделка принята!')

      return deal
    } catch (error) {
      this.handleError(error, 'Ошибка при принятии сделки')
      throw error
    }
  }

  async rejectDeal(id: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const deal = await ordersApi.rejectDeal(id)

      this.telegramStore.showAlert('Сделка отклонена!')

      return deal
    } catch (error) {
      this.handleError(error, 'Ошибка при отклонении сделки')
      throw error
    }
  }

  async completeDeal(id: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('success')

      const deal = await ordersApi.completeDeal(id)

      this.telegramStore.showAlert('Сделка завершена!')

      return deal
    } catch (error) {
      this.handleError(error, 'Ошибка при завершении сделки')
      throw error
    }
  }

  async cancelDeal(id: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const deal = await ordersApi.cancelDeal(id)

      this.telegramStore.showAlert('Сделка отменена!')

      return deal
    } catch (error) {
      this.handleError(error, 'Ошибка при отмене сделки')
      throw error
    }
  }

  // =============================================================================
  // SERVICE RESPONSES (Отклики студентов на услуги)
  // =============================================================================

  async getServiceResponses(serviceId: string): Promise<ServiceResponse[]> {
    try {
      return await ordersApi.getServiceResponses(serviceId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении откликов на услугу')
      throw error
    }
  }

  async getMyServiceResponses(): Promise<PaginatedResponse<ServiceResponse>> {
    try {
      return await ordersApi.getMyServiceResponses()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших откликов на услуги')
      throw error
    }
  }

  async createServiceResponse(data: CreateServiceResponseDto): Promise<ServiceResponse> {
    try {
      this.validateServiceResponseData(data)

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.createServiceResponse(data)

      this.telegramStore.showAlert('Отклик отправлен!')

      return response
    } catch (error) {
      this.handleError(error, 'Ошибка при отправке отклика')
      throw error
    }
  }

  async updateServiceResponse(
    id: string,
    data: Partial<CreateServiceResponseDto>,
  ): Promise<ServiceResponse> {
    try {
      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.updateServiceResponse(id, data)

      this.telegramStore.showAlert('Отклик обновлен!')

      return response
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении отклика')
      throw error
    }
  }

  async deleteServiceResponse(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await ordersApi.deleteServiceResponse(id)

      this.telegramStore.showAlert('Отклик удален!')
    } catch (error) {
      this.handleError(error, 'Ошибка при удалении отклика')
      throw error
    }
  }

  // =============================================================================
  // REQUEST RESPONSES (Отклики репетиторов на заявки)
  // =============================================================================

  async getRequestResponses(requestId: string): Promise<RequestResponse[]> {
    try {
      return await ordersApi.getRequestResponses(requestId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении откликов на заявку')
      throw error
    }
  }

  async getMyRequestResponses(): Promise<PaginatedResponse<RequestResponse>> {
    try {
      return await ordersApi.getMyRequestResponses()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших откликов на заявки')
      throw error
    }
  }

  async createRequestResponse(data: CreateRequestResponseDto): Promise<RequestResponse> {
    try {
      this.validateRequestResponseData(data)

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.createRequestResponse(data)

      this.telegramStore.showAlert('Отклик отправлен!')

      return response
    } catch (error) {
      this.handleError(error, 'Ошибка при отправке отклика')
      throw error
    }
  }

  async updateRequestResponse(
    id: string,
    data: Partial<CreateRequestResponseDto>,
  ): Promise<RequestResponse> {
    try {
      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.updateRequestResponse(id, data)

      this.telegramStore.showAlert('Отклик обновлен!')

      return response
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении отклика')
      throw error
    }
  }

  async deleteRequestResponse(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await ordersApi.deleteRequestResponse(id)

      this.telegramStore.showAlert('Отклик удален!')
    } catch (error) {
      this.handleError(error, 'Ошибка при удалении отклика')
      throw error
    }
  }

  // =============================================================================
  // VALIDATION METHODS
  // =============================================================================

  private validateRequestData(data: any): void {
    if (!data.subjectId) {
      throw new Error('Выберите предмет')
    }
    if (!data.teacherId) {
      throw new Error('Выберите преподавателя')
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
    if (data.budget && data.budget < 100) {
      throw new Error('Бюджет должен быть не менее 100 рублей')
    }
    if (data.budget && data.budget > 50000) {
      throw new Error('Бюджет не должен превышать 50000 рублей')
    }
  }

  private validateUpdateRequestData(data: any): void {
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
    if (data.budget && data.budget < 100) {
      throw new Error('Бюджет должен быть не менее 100 рублей')
    }
    if (data.budget && data.budget > 10000) {
      throw new Error('Бюджет не должен превышать 10000 рублей')
    }
  }

  private validateServiceResponseData(data: any): void {
    if (!data.serviceId) {
      throw new Error('Укажите услугу')
    }
    if (data.price && data.price < 100) {
      throw new Error('Цена должна быть не менее 100 рублей')
    }
    if (data.message && data.message.length > 500) {
      throw new Error('Сообщение не должно превышать 500 символов')
    }
  }

  private validateRequestResponseData(data: any): void {
    if (!data.requestId) {
      throw new Error('Укажите заявку')
    }
    if (data.price && data.price < 100) {
      throw new Error('Цена должна быть не менее 100 рублей')
    }
    if (data.message && data.message.length > 500) {
      throw new Error('Сообщение не должно превышать 500 символов')
    }
  }

  private normalizeRequestsResponse(data: any): PaginatedResponse<Request> {
    // Backend may return an array or an object with { items, total }
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      }
    }
    if (data && Array.isArray(data.items)) {
      const total = typeof data.total === 'number' ? data.total : data.items.length
      return {
        items: data.items,
        total,
        page: data.page ?? 1,
        limit: data.limit ?? data.items.length,
        totalPages: data.totalPages ?? 1,
      }
    }
    // Fallback to empty
    return { items: [], total: 0, page: 1, limit: 0, totalPages: 1 }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 403) {
      message = 'Недостаточно прав для выполнения операции'
    } else if (error.response?.status === 404) {
      message = 'Запись не найдена'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const orderService = new OrderService()
