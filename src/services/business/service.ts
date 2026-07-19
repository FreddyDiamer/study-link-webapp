import { tutorsApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type {
  Service,
  ServiceFilterDto,
  CreateServiceDto,
  UpdateServiceDto,
  PaginatedResponse,
} from '@/shared/types'

export class ServiceService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getServices(filters?: ServiceFilterDto): Promise<PaginatedResponse<Service>> {
    try {
      return await tutorsApi.getServices(filters)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении услуг')
      throw error
    }
  }

  async getActiveServices(): Promise<PaginatedResponse<Service>> {
    try {
      return await tutorsApi.getActiveServices()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении активных услуг')
      throw error
    }
  }

  async getPopularServices(limit?: number): Promise<PaginatedResponse<Service>> {
    try {
      return await tutorsApi.getPopularServices(limit)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении популярных услуг')
      throw error
    }
  }

  async getMyServices(): Promise<PaginatedResponse<Service>> {
    try {
      return await tutorsApi.getMyServices()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении ваших услуг')
      throw error
    }
  }

  async getService(id: string): Promise<Service> {
    try {
      return await tutorsApi.getService(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении услуги')
      throw error
    }
  }

  async createService(data: CreateServiceDto): Promise<Service> {
    try {
      this.validateServiceData(data)

      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.createService(data)

      this.telegramStore.showAlert('Услуга успешно создана!')

      return service
    } catch (error) {
      this.handleError(error, 'Ошибка при создании услуги')
      throw error
    }
  }

  async updateService(id: string, data: UpdateServiceDto): Promise<Service> {
    try {
      this.validateUpdateData(data)

      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.updateService(id, data)

      this.telegramStore.showAlert('Услуга обновлена!')

      return service
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении услуги')
      throw error
    }
  }

  async activateService(id: string): Promise<Service> {
    try {
      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.activateService(id)

      this.telegramStore.showAlert('Услуга активирована!')

      return service
    } catch (error) {
      this.handleError(error, 'Ошибка при активации услуги')
      throw error
    }
  }

  async deactivateService(id: string): Promise<Service> {
    try {
      this.telegramStore.hapticFeedback('light')

      const service = await tutorsApi.deactivateService(id)

      this.telegramStore.showAlert('Услуга деактивирована!')

      return service
    } catch (error) {
      this.handleError(error, 'Ошибка при деактивации услуги')
      throw error
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      this.telegramStore.hapticFeedback('medium')

      await tutorsApi.deleteService(id)

      this.telegramStore.showAlert('Услуга удалена!')
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
    if (!data.price || data.price < 100) {
      throw new Error('Цена должна быть не менее 100 рублей')
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
  }

  private validateUpdateData(data: any): void {
    if (data.price !== undefined) {
      if (data.price < 100) {
        throw new Error('Цена должна быть не менее 100 рублей')
      }
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
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
