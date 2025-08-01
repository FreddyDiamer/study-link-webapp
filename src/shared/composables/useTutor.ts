import { ref } from 'vue'
import { tutorService } from '@/services/business'
import type { Tutor, PaginatedResponse, TutorSearchParams } from '@/shared/types'

export const useTutor = () => {
  const favorites = ref<PaginatedResponse<Tutor> | null>(null)
  const isLoading = ref(false)

  const searchTutors = async (params: TutorSearchParams) => {
    isLoading.value = true
    try {
      const response = await tutorService.searchTutors(params)
      return response
    } catch (error) {
      console.error('Ошибка поиска репетиторов:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getFavoriteTutors = async () => {
    isLoading.value = true
    try {
      const response = await tutorService.getFavorites()
      favorites.value = response
      return response
    } catch (error) {
      console.error('Ошибка получения избранных репетиторов:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeFromFavorites = async (tutorId: string) => {
    try {
      await tutorService.removeFromFavorites(tutorId)
      // Обновляем локальное состояние
      if (favorites.value) {
        favorites.value.items = favorites.value.items.filter((tutor) => tutor.id !== tutorId)
        favorites.value.total -= 1
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error)
      throw error
    }
  }

  const isFavorite = (tutorId: string) => {
    return favorites.value?.items.some((tutor) => tutor.id === tutorId) || false
  }

  const getTutorStats = async () => {
    try {
      return await tutorService.getStats()
    } catch (error) {
      console.error('Ошибка получения статистики репетитора:', error)
      throw error
    }
  }

  return {
    favorites,
    isLoading,
    searchTutors,
    getFavoriteTutors,
    removeFromFavorites,
    isFavorite,
    getTutorStats,
  }
}
