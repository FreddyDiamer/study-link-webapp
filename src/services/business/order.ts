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

/** Денежные границы в копейках: от 100 ₽ до 50 000 ₽. */
const MIN_MONEY_KOPEKS = 10_000
const MAX_MONEY_KOPEKS = 5_000_000

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
      const normalized = this.normalizeRequestsResponse(response)
      return this.convertRequestsToRubles(normalized)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении заявок')
      throw error
    }
  }

  async getMyRequests(): Promise<PaginatedResponse<Request>> {
    try {
      const response = await ordersApi.getMyRequests()
      return this.convertRequestsToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших заявок')
      throw error
    }
  }

  async getRequest(id: string): Promise<Request> {
    try {
      const request = await ordersApi.getRequest(id)
      return this.convertRequestToRubles(request)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении заявки')
      throw error
    }
  }

  async createRequest(
    data: Omit<CreateRequestDto, 'budget'> & { budget?: number },
  ): Promise<Request> {
    try {
      this.validateRequestData(data)

      const requestData: CreateRequestDto = {
        ...data,
        budget: data.budget,
      }

      this.telegramStore.hapticFeedback('light')

      const request = await ordersApi.createRequest(requestData)

      this.telegramStore.showAlert('Заявка создана!')

      return this.convertRequestToRubles(request)
    } catch (error) {
      this.handleError(error, 'Ошибка при создании заявки')
      throw error
    }
  }

  async updateRequest(
    id: string,
    data: Omit<UpdateRequestDto, 'budget'> & { budget?: number },
  ): Promise<Request> {
    try {
      this.validateUpdateRequestData(data)

      const updateData: UpdateRequestDto = {
        ...data,
        budget: data.budget,
      }

      this.telegramStore.hapticFeedback('light')

      const request = await ordersApi.updateRequest(id, updateData)

      this.telegramStore.showAlert('Заявка обновлена!')

      return this.convertRequestToRubles(request)
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении заявки')
      throw error
    }
  }

  async closeRequest(id: string): Promise<Request> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const request = await ordersApi.closeRequest(id)

      return this.convertRequestToRubles(request)
    } catch (error) {
      this.handleError(error, 'Ошибка при закрытии заявки')
      throw error
    }
  }

  async reopenRequest(id: string): Promise<Request> {
    try {
      this.telegramStore.hapticFeedback('success')

      const request = await ordersApi.reopenRequest(id)

      return this.convertRequestToRubles(request)
    } catch (error) {
      this.handleError(error, 'Ошибка при переоткрытии заявки')
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
      const response = await ordersApi.getDeals(params)
      return this.convertDealsToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении сделок')
      throw error
    }
  }

  async getMyTutorDeals(): Promise<PaginatedResponse<Deal>> {
    try {
      const response = await ordersApi.getMyTutorDeals()
      return this.convertDealsToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших сделок как репетитора')
      throw error
    }
  }

  async getDeal(id: string): Promise<Deal> {
    try {
      const deal = await ordersApi.getDeal(id)
      return this.convertDealToRubles(deal)
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
      return this.convertDealToRubles(deal)
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

      return this.convertDealToRubles(deal)
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

      return this.convertDealToRubles(deal)
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

      return this.convertDealToRubles(deal)
    } catch (error) {
      this.handleError(error, 'Ошибка при завершении сделки')
      throw error
    }
  }

  async reopenDeal(id: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('light')

      const deal = await ordersApi.reopenDeal(id)

      this.telegramStore.showAlert('Сделка снова в работе')

      return this.convertDealToRubles(deal)
    } catch (error) {
      this.handleError(error, 'Ошибка при возврате сделки в работу')
      throw error
    }
  }

  async cancelDeal(id: string, reason?: string): Promise<Deal> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const deal = await ordersApi.cancelDeal(id, reason)

      this.telegramStore.showAlert('Сделка отменена!')

      return this.convertDealToRubles(deal)
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
      const responses = await ordersApi.getServiceResponses(serviceId)
      return responses.map((response) => this.convertServiceResponseToRubles(response))
    } catch (error) {
      this.handleError(error, 'Ошибка при получении откликов на услугу')
      throw error
    }
  }

  async getMyServiceResponses(): Promise<PaginatedResponse<ServiceResponse>> {
    try {
      const response = await ordersApi.getMyServiceResponses()
      return this.convertServiceResponsesToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших откликов на услуги')
      throw error
    }
  }

  async createServiceResponse(
    data: Omit<CreateServiceResponseDto, 'price'> & { price?: number },
  ): Promise<ServiceResponse> {
    try {
      this.validateServiceResponseData(data)

      const responseData: CreateServiceResponseDto = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.createServiceResponse(responseData)

      this.telegramStore.showAlert('Отклик отправлен!')

      return this.convertServiceResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при отправке отклика')
      throw error
    }
  }

  async updateServiceResponse(
    id: string,
    data: Partial<CreateServiceResponseDto> & { price?: number },
  ): Promise<ServiceResponse> {
    try {
      const updateData: Partial<CreateServiceResponseDto> = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.updateServiceResponse(id, updateData)

      this.telegramStore.showAlert('Отклик обновлен!')

      return this.convertServiceResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении отклика')
      throw error
    }
  }

  async acceptServiceResponse(id: string): Promise<ServiceResponse> {
    try {
      this.telegramStore.hapticFeedback('success')

      const response = await ordersApi.acceptServiceResponse(id)

      this.telegramStore.showAlert('Сделка создана!')

      return this.convertServiceResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при принятии отклика')
      throw error
    }
  }

  async rejectServiceResponse(id: string): Promise<ServiceResponse> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const response = await ordersApi.rejectServiceResponse(id)

      return this.convertServiceResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при отклонении отклика')
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
      const responses = await ordersApi.getRequestResponses(requestId)
      return responses.map((response) => this.convertRequestResponseToRubles(response))
    } catch (error) {
      this.handleError(error, 'Ошибка при получении откликов на заявку')
      throw error
    }
  }

  async getMyRequestResponses(): Promise<PaginatedResponse<RequestResponse>> {
    try {
      const response = await ordersApi.getMyRequestResponses()
      return this.convertRequestResponsesToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших откликов на заявки')
      throw error
    }
  }

  async createRequestResponse(
    data: Omit<CreateRequestResponseDto, 'price'> & { price?: number },
  ): Promise<RequestResponse> {
    try {
      this.validateRequestResponseData(data)

      const responseData: CreateRequestResponseDto = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.createRequestResponse(responseData)

      this.telegramStore.showAlert('Отклик отправлен!')

      return this.convertRequestResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при отправке отклика')
      throw error
    }
  }

  async updateRequestResponse(
    id: string,
    data: Partial<CreateRequestResponseDto> & { price?: number },
  ): Promise<RequestResponse> {
    try {
      const updateData: Partial<CreateRequestResponseDto> = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const response = await ordersApi.updateRequestResponse(id, updateData)

      this.telegramStore.showAlert('Отклик обновлен!')

      return this.convertRequestResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении отклика')
      throw error
    }
  }

  async acceptRequestResponse(id: string): Promise<RequestResponse> {
    try {
      this.telegramStore.hapticFeedback('success')

      const response = await ordersApi.acceptRequestResponse(id)

      this.telegramStore.showAlert('Сделка создана!')

      return this.convertRequestResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при принятии отклика')
      throw error
    }
  }

  async rejectRequestResponse(id: string): Promise<RequestResponse> {
    try {
      this.telegramStore.hapticFeedback('medium')

      const response = await ordersApi.rejectRequestResponse(id)

      return this.convertRequestResponseToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при отклонении отклика')
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
    this.validateMoney(data.budget, 'Бюджет')
  }

  private validateUpdateRequestData(data: any): void {
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
    this.validateMoney(data.budget, 'Бюджет')
  }

  private validateServiceResponseData(data: any): void {
    if (!data.serviceId) {
      throw new Error('Укажите услугу')
    }
    this.validateMoney(data.price, 'Цена')
    if (data.message && data.message.length > 500) {
      throw new Error('Сообщение не должно превышать 500 символов')
    }
  }

  private validateRequestResponseData(data: any): void {
    if (!data.requestId) {
      throw new Error('Укажите заявку')
    }
    this.validateMoney(data.price, 'Цена')
    if (data.message && data.message.length > 500) {
      throw new Error('Сообщение не должно превышать 500 символов')
    }
  }

  /**
   * Суммы ходят в копейках, а пользователю сообщаем в рублях.
   * Порог не применяется к пустому значению: бюджет и цена отклика необязательны.
   */
  private validateMoney(kopeks: number | undefined, label: string): void {
    if (!kopeks) return
    if (kopeks < MIN_MONEY_KOPEKS) {
      throw new Error(`${label} должна быть не менее ${MIN_MONEY_KOPEKS / 100} рублей`)
    }
    if (kopeks > MAX_MONEY_KOPEKS) {
      throw new Error(`${label} не должна превышать ${MAX_MONEY_KOPEKS / 100} рублей`)
    }
  }

  // =============================================================================
  // CONVERSION METHODS
  // =============================================================================

  private convertRequestToRubles(request: Request): Request {
    return {
      ...request,
      budget: request.budget,
    }
  }

  private convertRequestsToRubles(
    response: PaginatedResponse<Request>,
  ): PaginatedResponse<Request> {
    return {
      ...response,
      items: response.items.map((request) => this.convertRequestToRubles(request)),
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

  private convertDealToRubles(deal: Deal): Deal {
    return {
      ...deal,
      price: deal.price,
    }
  }

  private convertDealsToRubles(response: PaginatedResponse<Deal>): PaginatedResponse<Deal> {
    return {
      ...response,
      items: response.items.map((deal) => this.convertDealToRubles(deal)),
    }
  }

  private convertServiceResponseToRubles(response: ServiceResponse): ServiceResponse {
    return {
      ...response,
      price: response.price,
    }
  }

  private convertServiceResponsesToRubles(
    response: PaginatedResponse<ServiceResponse>,
  ): PaginatedResponse<ServiceResponse> {
    return {
      ...response,
      items: response.items.map((resp) => this.convertServiceResponseToRubles(resp)),
    }
  }

  private convertRequestResponseToRubles(response: RequestResponse): RequestResponse {
    return {
      ...response,
      price: response.price,
    }
  }

  private convertRequestResponsesToRubles(
    response: PaginatedResponse<RequestResponse>,
  ): PaginatedResponse<RequestResponse> {
    return {
      ...response,
      items: response.items.map((resp) => this.convertRequestResponseToRubles(resp)),
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
