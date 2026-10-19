import { tutorsApi } from '@/services/api'
import { formError } from './errors'
import { useTelegramStore } from '@/stores'
import type { Service, CreateServiceDto, UpdateServiceDto, PaginatedResponse } from '@/shared/types'

/** Минимальная цена услуги в копейках (100 ₽). */
const MIN_PRICE_KOPEKS = 10_000

export class ServiceService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getMyServices(): Promise<PaginatedResponse<Service>> {
    try {
      const response = await tutorsApi.getMyServices()
      return this.convertServicesToRubles(response)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших услуг')
      throw error
    }
  }

  async createService(data: Omit<CreateServiceDto, 'price'> & { price: number }): Promise<Service> {
    try {
      this.validateServiceData(data)

      // Конвертируем цену в копейки
      const serviceData: CreateServiceDto = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.createService(serviceData)

      return this.convertServiceToRubles(service)
    } catch (error) {
      // форма показывает причину у кнопки — модальный алерт здесь лишний
      this.telegramStore.hapticFeedback('error')
      throw formError(
        error,
        'Не получилось опубликовать услугу',
        'Предмет или преподаватель не найдены',
      )
    }
  }

  async updateService(
    id: string,
    data: Omit<UpdateServiceDto, 'price'> & { price?: number },
  ): Promise<Service> {
    try {
      this.validateUpdateData(data)

      // Конвертируем цену в копейки если она есть
      const updateData: UpdateServiceDto = {
        ...data,
        price: data.price,
      }

      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.updateService(id, updateData)

      return this.convertServiceToRubles(service)
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении услуги')
      throw error
    }
  }

  async activateService(id: string): Promise<Service> {
    try {
      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.activateService(id)

      return this.convertServiceToRubles(service)
    } catch (error) {
      this.handleError(error, 'Ошибка при активации услуги')
      throw error
    }
  }

  async deactivateService(id: string): Promise<Service> {
    try {
      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.deactivateService(id)

      return this.convertServiceToRubles(service)
    } catch (error) {
      this.handleError(error, 'Ошибка при деактивации услуги')
      throw error
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await tutorsApi.deleteService(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при удалении услуги')
      throw error
    }
  }

  private validateServiceData(data: any): void {
    if (!data.subjectId) {
      throw new Error('Выберите предмет')
    }
    if (!data.teacherId) {
      throw new Error('Выберите преподавателя')
    }
    if (!data.price || data.price < MIN_PRICE_KOPEKS) {
      throw new Error(`Цена должна быть не менее ${MIN_PRICE_KOPEKS / 100} рублей`)
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
  }

  private validateUpdateData(data: any): void {
    if (data.price !== undefined && data.price < MIN_PRICE_KOPEKS) {
      throw new Error(`Цена должна быть не менее ${MIN_PRICE_KOPEKS / 100} рублей`)
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
  }

  private convertServicesToRubles(
    response: PaginatedResponse<Service>,
  ): PaginatedResponse<Service> {
    return {
      ...response,
      items: response.items.map((service) => this.convertServiceToRubles(service)),
    }
  }

  private convertServiceToRubles(service: Service): Service {
    return {
      ...service,
      price: service.price,
    }
  }

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 403) {
      message = 'Недостаточно прав для выполнения операции'
    } else if (error.response?.status === 404) {
      message = 'Услуга не найдена'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const serviceService = new ServiceService()
