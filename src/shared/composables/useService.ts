import { ref } from 'vue'
import { tutorsApi } from '@/services/api'
import type { Service, PaginatedResponse, CreateServiceDto, UpdateServiceDto } from '@/shared/types'

export const useService = () => {
  const services = ref<PaginatedResponse<Service> | null>(null)
  const isLoading = ref(false)

  const getServices = async (params?: any) => {
    isLoading.value = true
    try {
      services.value = await tutorsApi.getServices(params)
      return services.value
    } finally {
      isLoading.value = false
    }
  }

  const getActiveServices = async () => {
    isLoading.value = true
    try {
      services.value = await tutorsApi.getActiveServices()
      return services.value
    } finally {
      isLoading.value = false
    }
  }

  const getMyServices = async () => {
    isLoading.value = true
    try {
      services.value = await tutorsApi.getMyServices()
      return services.value
    } finally {
      isLoading.value = false
    }
  }

  const getService = async (id: string) => {
    isLoading.value = true
    try {
      return await tutorsApi.getService(id)
    } finally {
      isLoading.value = false
    }
  }

  const createService = async (data: CreateServiceDto) => {
    isLoading.value = true
    try {
      const service = await tutorsApi.createService(data)
      // Обновляем список услуг
      await getMyServices()
      return service
    } finally {
      isLoading.value = false
    }
  }

  const updateService = async (id: string, data: UpdateServiceDto) => {
    isLoading.value = true
    try {
      const service = await tutorsApi.updateService(id, data)
      // Обновляем список услуг
      await getMyServices()
      return service
    } finally {
      isLoading.value = false
    }
  }

  const deleteService = async (id: string) => {
    isLoading.value = true
    try {
      await tutorsApi.deleteService(id)
      // Обновляем список услуг
      await getMyServices()
    } finally {
      isLoading.value = false
    }
  }

  const activateService = async (id: string) => {
    isLoading.value = true
    try {
      const service = await tutorsApi.activateService(id)
      // Обновляем список услуг
      await getMyServices()
      return service
    } finally {
      isLoading.value = false
    }
  }

  const deactivateService = async (id: string) => {
    isLoading.value = true
    try {
      const service = await tutorsApi.deactivateService(id)
      // Обновляем список услуг
      await getMyServices()
      return service
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    services,
    isLoading,

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
