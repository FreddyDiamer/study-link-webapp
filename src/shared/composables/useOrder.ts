import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { orderService } from '@/services/business'
import { useAuthStore } from '@/stores/auth'
import { queryKeys } from '@/shared/lib/query-keys'
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
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  const studentDealsEnabled = computed(() => !!authStore.user?.id)

  // =============================================================================
  // REQUESTS (Заявки студентов)
  // =============================================================================

  const getRequests = (params?: any) => {
    return useQuery({
      queryKey: queryKeys.requests(params),
      queryFn: () => orderService.getRequests(params),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyRequests = () => {
    return useQuery({
      queryKey: queryKeys.myRequests(),
      queryFn: () => orderService.getMyRequests(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getRequest = (id: string) => {
    return useQuery({
      queryKey: queryKeys.request(id),
      queryFn: () => orderService.getRequest(id),
      enabled: !!id,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const createRequest = () => {
    return useMutation({
      mutationFn: (data: Omit<CreateRequestDto, 'budget'> & { budget?: number }) =>
        orderService.createRequest(data),
      onSuccess: () => {
        // Инвалидируем кэш заявок после создания
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() })
        queryClient.invalidateQueries({ queryKey: queryKeys.requests() })
      },
    })
  }

  const updateRequest = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: Omit<UpdateRequestDto, 'budget'> & { budget?: number }
      }) => orderService.updateRequest(id, data),
      onSuccess: (_, variables) => {
        // Инвалидируем кэш конкретной заявки и списка
        queryClient.invalidateQueries({ queryKey: queryKeys.request(variables.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() })
        queryClient.invalidateQueries({ queryKey: queryKeys.requests() })
      },
    })
  }

  const deleteRequest = () => {
    return useMutation({
      mutationFn: (id: string) => orderService.deleteRequest(id),
      onSuccess: () => {
        // Инвалидируем кэш заявок после удаления
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() })
        queryClient.invalidateQueries({ queryKey: queryKeys.requests() })
      },
    })
  }

  // =============================================================================
  // DEALS (Сделки)
  // =============================================================================

  const getDeals = (params?: any) => {
    return useQuery({
      queryKey: queryKeys.deals(params),
      queryFn: () => orderService.getDeals(params),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyStudentDeals = () => {
    return useQuery({
      queryKey: queryKeys.myStudentDeals(),
      queryFn: () => {
        const userId = authStore.user?.id
        return orderService.getDeals(userId ? { studentId: userId } : undefined)
      },
      enabled: studentDealsEnabled,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyTutorDeals = () => {
    return useQuery({
      queryKey: queryKeys.myTutorDeals(),
      queryFn: () => orderService.getMyTutorDeals(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getDeal = (id: string) => {
    return useQuery({
      queryKey: queryKeys.deal(id),
      queryFn: () => orderService.getDeal(id),
      enabled: !!id,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const updateDeal = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: Partial<Pick<Deal, 'status' | 'price' | 'deadline'>>
      }) => orderService.updateDeal(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.deal(variables.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myTutorDeals() })
        queryClient.invalidateQueries({ queryKey: queryKeys.myStudentDeals() })
        queryClient.invalidateQueries({ queryKey: queryKeys.deals() })
      },
    })
  }

  const acceptDeal = () => {
    return useMutation({
      mutationFn: (dealId: string) => orderService.acceptDeal(dealId),
      onSuccess: (_, dealId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myTutorDeals() })
        queryClient.invalidateQueries({ queryKey: queryKeys.myStudentDeals() })
      },
    })
  }

  const rejectDeal = () => {
    return useMutation({
      mutationFn: (dealId: string) => orderService.rejectDeal(dealId),
      onSuccess: (_, dealId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myTutorDeals() })
        queryClient.invalidateQueries({ queryKey: queryKeys.myStudentDeals() })
      },
    })
  }

  const completeDeal = () => {
    return useMutation({
      mutationFn: (dealId: string) => orderService.completeDeal(dealId),
      onSuccess: (_, dealId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myTutorDeals() })
        queryClient.invalidateQueries({ queryKey: queryKeys.myStudentDeals() })
      },
    })
  }

  // =============================================================================
  // SERVICE RESPONSES (Отклики студентов на услуги)
  // =============================================================================

  const getServiceResponses = (serviceId: string) => {
    return useQuery({
      queryKey: queryKeys.serviceResponses(serviceId),
      queryFn: () => orderService.getServiceResponses(serviceId),
      enabled: !!serviceId,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyServiceResponses = () => {
    return useQuery({
      queryKey: queryKeys.myServiceResponses(),
      queryFn: () => orderService.getMyServiceResponses(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const createServiceResponse = () => {
    return useMutation({
      mutationFn: (data: Omit<CreateServiceResponseDto, 'price'> & { price?: number }) =>
        orderService.createServiceResponse(data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.serviceResponses(variables.serviceId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myServiceResponses() })
      },
    })
  }

  const updateServiceResponse = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: Partial<CreateServiceResponseDto> & { price?: number }
      }) => orderService.updateServiceResponse(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.myServiceResponses() })
        // Также инвалидируем все service responses, так как мы не знаем serviceId
        queryClient.invalidateQueries({ queryKey: ['user', 'service-responses'] })
      },
    })
  }

  const deleteServiceResponse = () => {
    return useMutation({
      mutationFn: (id: string) => orderService.deleteServiceResponse(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.myServiceResponses() })
        queryClient.invalidateQueries({ queryKey: ['user', 'service-responses'] })
      },
    })
  }

  // =============================================================================
  // REQUEST RESPONSES (Отклики репетиторов на заявки)
  // =============================================================================

  const getRequestResponses = (requestId: string) => {
    return useQuery({
      queryKey: queryKeys.requestResponses(requestId),
      queryFn: () => orderService.getRequestResponses(requestId),
      enabled: !!requestId,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyRequestResponses = () => {
    return useQuery({
      queryKey: queryKeys.myRequestResponses(),
      queryFn: () => orderService.getMyRequestResponses(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const createRequestResponse = () => {
    return useMutation({
      mutationFn: (data: Omit<CreateRequestResponseDto, 'price'> & { price?: number }) =>
        orderService.createRequestResponse(data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.requestResponses(variables.requestId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequestResponses() })
      },
    })
  }

  const updateRequestResponse = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: Partial<CreateRequestResponseDto> & { price?: number }
      }) => orderService.updateRequestResponse(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequestResponses() })
        queryClient.invalidateQueries({ queryKey: ['user', 'request-responses'] })
      },
    })
  }

  const deleteRequestResponse = () => {
    return useMutation({
      mutationFn: (id: string) => orderService.deleteRequestResponse(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.myRequestResponses() })
        queryClient.invalidateQueries({ queryKey: ['user', 'request-responses'] })
      },
    })
  }

  return {
    // Requests
    getRequests,
    getMyRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,

    // Deals
    getDeals,
    getMyStudentDeals,
    getMyTutorDeals,
    getDeal,
    updateDeal,
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
