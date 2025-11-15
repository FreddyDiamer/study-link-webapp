import { ref } from 'vue'
import { orderService } from '@/services/business'
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

export const useOrder = () => {
  const requests = ref<PaginatedResponse<Request> | null>(null)
  const deals = ref<PaginatedResponse<Deal> | null>(null)
  const serviceResponses = ref<PaginatedResponse<ServiceResponse> | null>(null)
  const requestResponses = ref<PaginatedResponse<RequestResponse> | null>(null)
  const isLoading = ref(false)

  // =============================================================================
  // REQUESTS (Заявки студентов)
  // =============================================================================

  const getRequests = async (params?: any) => {
    isLoading.value = true
    try {
      requests.value = await orderService.getRequests(params)
      return requests.value
    } finally {
      isLoading.value = false
    }
  }

  const getMyRequests = async () => {
    isLoading.value = true
    try {
      requests.value = await orderService.getMyRequests()
      return requests.value
    } finally {
      isLoading.value = false
    }
  }

  const getRequest = async (id: string) => {
    isLoading.value = true
    try {
      return await orderService.getRequest(id)
    } finally {
      isLoading.value = false
    }
  }

  const createRequest = async (data: Omit<CreateRequestDto, 'budget'> & { budget?: number }) => {
    isLoading.value = true
    try {
      const request = await orderService.createRequest(data)
      // Обновляем список заявок
      await getMyRequests()
      return request
    } finally {
      isLoading.value = false
    }
  }

  const updateRequest = async (
    id: string,
    data: Omit<UpdateRequestDto, 'budget'> & { budget?: number },
  ) => {
    isLoading.value = true
    try {
      const request = await orderService.updateRequest(id, data)
      // Обновляем список заявок
      await getMyRequests()
      return request
    } finally {
      isLoading.value = false
    }
  }

  const deleteRequest = async (id: string) => {
    isLoading.value = true
    try {
      await orderService.deleteRequest(id)
      // Обновляем список заявок
      await getMyRequests()
    } finally {
      isLoading.value = false
    }
  }

  // =============================================================================
  // DEALS (Сделки)
  // =============================================================================

  const getDeals = async (params?: any) => {
    isLoading.value = true
    try {
      deals.value = await orderService.getDeals(params)
      return deals.value
    } finally {
      isLoading.value = false
    }
  }

  const getMyTutorDeals = async () => {
    try {
      const response = await orderService.getMyTutorDeals()
      return response
    } catch (error) {
      console.error('Ошибка получения сделок репетитора:', error)
      throw error
    }
  }

  const getDeal = async (id: string) => {
    isLoading.value = true
    try {
      return await orderService.getDeal(id)
    } finally {
      isLoading.value = false
    }
  }

  const updateDeal = async (
    id: string,
    data: Partial<Pick<Deal, 'status' | 'price' | 'deadline'>>,
  ) => {
    try {
      const response = await orderService.updateDeal(id, data)
      return response
    } catch (error) {
      console.error('Ошибка обновления сделки:', error)
      throw error
    }
  }

  const acceptDeal = async (dealId: string) => {
    try {
      const response = await orderService.acceptDeal(dealId)
      return response
    } catch (error) {
      console.error('Ошибка принятия сделки:', error)
      throw error
    }
  }

  const rejectDeal = async (dealId: string) => {
    try {
      const response = await orderService.rejectDeal(dealId)
      return response
    } catch (error) {
      console.error('Ошибка отклонения сделки:', error)
      throw error
    }
  }

  const completeDeal = async (dealId: string) => {
    try {
      const response = await orderService.completeDeal(dealId)
      return response
    } catch (error) {
      console.error('Ошибка завершения сделки:', error)
      throw error
    }
  }

  // =============================================================================
  // SERVICE RESPONSES (Отклики студентов на услуги)
  // =============================================================================

  const getServiceResponses = async (serviceId: string) => {
    isLoading.value = true
    try {
      return await orderService.getServiceResponses(serviceId)
    } finally {
      isLoading.value = false
    }
  }

  const getMyServiceResponses = async () => {
    isLoading.value = true
    try {
      serviceResponses.value = await orderService.getMyServiceResponses()
      return serviceResponses.value
    } finally {
      isLoading.value = false
    }
  }

  const createServiceResponse = async (
    data: Omit<CreateServiceResponseDto, 'price'> & { price?: number },
  ) => {
    isLoading.value = true
    try {
      const response = await orderService.createServiceResponse(data)
      // Обновляем список откликов
      await getMyServiceResponses()
      return response
    } finally {
      isLoading.value = false
    }
  }

  const updateServiceResponse = async (
    id: string,
    data: Partial<CreateServiceResponseDto> & { price?: number },
  ) => {
    isLoading.value = true
    try {
      const response = await orderService.updateServiceResponse(id, data)
      // Обновляем список откликов
      await getMyServiceResponses()
      return response
    } finally {
      isLoading.value = false
    }
  }

  const deleteServiceResponse = async (id: string) => {
    isLoading.value = true
    try {
      await orderService.deleteServiceResponse(id)
      // Обновляем список откликов
      await getMyServiceResponses()
    } finally {
      isLoading.value = false
    }
  }

  // =============================================================================
  // REQUEST RESPONSES (Отклики репетиторов на заявки)
  // =============================================================================

  const getRequestResponses = async (requestId: string) => {
    isLoading.value = true
    try {
      return await orderService.getRequestResponses(requestId)
    } finally {
      isLoading.value = false
    }
  }

  const getMyRequestResponses = async () => {
    isLoading.value = true
    try {
      requestResponses.value = await orderService.getMyRequestResponses()
      return requestResponses.value
    } finally {
      isLoading.value = false
    }
  }

  const createRequestResponse = async (
    data: Omit<CreateRequestResponseDto, 'price'> & { price?: number },
  ) => {
    isLoading.value = true
    try {
      const response = await orderService.createRequestResponse(data)
      // Обновляем список откликов
      await getMyRequestResponses()
      return response
    } finally {
      isLoading.value = false
    }
  }

  const updateRequestResponse = async (
    id: string,
    data: Partial<CreateRequestResponseDto> & { price?: number },
  ) => {
    isLoading.value = true
    try {
      const response = await orderService.updateRequestResponse(id, data)
      // Обновляем список откликов
      await getMyRequestResponses()
      return response
    } finally {
      isLoading.value = false
    }
  }

  const deleteRequestResponse = async (id: string) => {
    isLoading.value = true
    try {
      await orderService.deleteRequestResponse(id)
      // Обновляем список откликов
      await getMyRequestResponses()
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    requests,
    deals,
    serviceResponses,
    requestResponses,
    isLoading,

    // Requests
    getRequests,
    getMyRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,

    // Deals
    getDeals,
    getMyTutorDeals,
    getDeal,
    acceptDeal,
    rejectDeal,
    completeDeal,

    // Service Responses
    getServiceResponses,
    getMyServiceResponses,
    createServiceResponse,
    updateServiceResponse,
    deleteServiceResponse,

    // Request Responses
    getRequestResponses,
    getMyRequestResponses,
    createRequestResponse,
    updateRequestResponse,
    deleteRequestResponse,
  }
}
