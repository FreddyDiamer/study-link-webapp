import { ref } from 'vue'
import { tutorsApi } from '@/services/api'
import { serviceService } from '@/services/business'
import type { Service, PaginatedResponse, CreateServiceDto, UpdateServiceDto } from '@/shared/types'

export const useService = () => {
  const services = ref<PaginatedResponse<Service> | null>(null)
  const isLoading = ref(false)

  // Чтение — напрямую из API: экраны сами рисуют честное состояние сбоя (LoadError),
  // а бизнес-слой добавил бы поверх него ещё и алерт
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

  // Действия — через бизнес-слой: валидация, вибро и сбой по-русски в алерте.
  // Список «моих услуг» после них не перезапрашиваем: его грузит профиль при возврате,
  // а упавший лишний запрос выдал бы успешное действие за неудачное
  const createService = async (data: CreateServiceDto) => {
    isLoading.value = true
    try {
      return await serviceService.createService(data)
    } finally {
      isLoading.value = false
    }
  }

  const updateService = async (id: string, data: UpdateServiceDto) => {
    isLoading.value = true
    try {
      return await serviceService.updateService(id, data)
    } finally {
      isLoading.value = false
    }
  }

  const deleteService = async (id: string) => {
    isLoading.value = true
    try {
      await serviceService.deleteService(id)
    } finally {
      isLoading.value = false
    }
  }

  const activateService = async (id: string) => {
    isLoading.value = true
    try {
      return await serviceService.activateService(id)
    } finally {
      isLoading.value = false
    }
  }

  const deactivateService = async (id: string) => {
    isLoading.value = true
    try {
      return await serviceService.deactivateService(id)
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
