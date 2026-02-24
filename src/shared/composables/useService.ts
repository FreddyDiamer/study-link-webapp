import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { tutorsApi } from '@/services/api'
import { queryKeys } from '@/shared/lib/query-keys'
import type { Service, PaginatedResponse, CreateServiceDto, UpdateServiceDto } from '@/shared/types'

export const useService = () => {
  const queryClient = useQueryClient()

  const getServices = (params?: any) => {
    return useQuery({
      queryKey: queryKeys.services(params),
      queryFn: () => tutorsApi.getServices(params),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getActiveServices = () => {
    return useQuery({
      queryKey: queryKeys.activeServices(),
      queryFn: () => tutorsApi.getActiveServices(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getMyServices = () => {
    return useQuery({
      queryKey: queryKeys.myServices(),
      queryFn: () => tutorsApi.getMyServices(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const getService = (id: string) => {
    return useQuery({
      queryKey: queryKeys.service(id),
      queryFn: () => tutorsApi.getService(id),
      enabled: !!id,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  const createService = () => {
    return useMutation({
      mutationFn: (data: CreateServiceDto) => tutorsApi.createService(data),
      onSuccess: () => {
        // Инвалидируем кэш услуг после создания
        queryClient.invalidateQueries({ queryKey: queryKeys.myServices() })
        queryClient.invalidateQueries({ queryKey: queryKeys.services() })
        queryClient.invalidateQueries({ queryKey: queryKeys.activeServices() })
      },
    })
  }

  const updateService = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) =>
        tutorsApi.updateService(id, data),
      onSuccess: (_, variables) => {
        // Инвалидируем кэш конкретной услуги и списка
        queryClient.invalidateQueries({ queryKey: queryKeys.service(variables.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myServices() })
        queryClient.invalidateQueries({ queryKey: queryKeys.services() })
        queryClient.invalidateQueries({ queryKey: queryKeys.activeServices() })
      },
    })
  }

  const deleteService = () => {
    return useMutation({
      mutationFn: (id: string) => tutorsApi.deleteService(id),
      onSuccess: () => {
        // Инвалидируем кэш услуг после удаления
        queryClient.invalidateQueries({ queryKey: queryKeys.myServices() })
        queryClient.invalidateQueries({ queryKey: queryKeys.services() })
        queryClient.invalidateQueries({ queryKey: queryKeys.activeServices() })
      },
    })
  }

  const activateService = () => {
    return useMutation({
      mutationFn: (id: string) => tutorsApi.activateService(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.service(id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myServices() })
        queryClient.invalidateQueries({ queryKey: queryKeys.activeServices() })
      },
    })
  }

  const deactivateService = () => {
    return useMutation({
      mutationFn: (id: string) => tutorsApi.deactivateService(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.service(id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.myServices() })
        queryClient.invalidateQueries({ queryKey: queryKeys.activeServices() })
      },
    })
  }

  return {
    // Methods
    getServices,
    getActiveServices,
    getMyServices,
    getService,
    createService,
    updateService,
    deleteService,
    activateService,
    deactivateService,
  }
}
