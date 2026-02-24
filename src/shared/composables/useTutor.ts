import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { tutorService } from '@/services/business'
import { queryKeys } from '@/shared/lib/query-keys'
import type { Tutor, PaginatedResponse, TutorSearchParams } from '@/shared/types'

export const useTutor = () => {
  const queryClient = useQueryClient()

  // Поиск репетиторов
  const searchTutors = (params: TutorSearchParams) => {
    return useQuery({
      queryKey: queryKeys.tutors(params),
      queryFn: () => tutorService.searchTutors(params),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  // Получить репетитора по ID
  const getTutor = (id: string) => {
    return useQuery({
      queryKey: queryKeys.tutor(id),
      queryFn: () => tutorService.getTutorById(id),
      enabled: !!id,
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  // Получить избранных репетиторов
  const getFavoriteTutors = () => {
    return useQuery({
      queryKey: queryKeys.favoriteTutors(),
      queryFn: () => tutorService.getFavorites(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  // Получить популярных репетиторов
  const getPopularTutors = (limit?: number) => {
    return useQuery({
      queryKey: queryKeys.popularTutors(limit),
      queryFn: () => tutorService.getPopular(limit),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  // Добавить в избранное
  const addToFavorites = () => {
    return useMutation({
      mutationFn: (tutorId: string) => tutorService.addToFavorites(tutorId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.favoriteTutors() })
      },
    })
  }

  // Удалить из избранного
  const removeFromFavorites = () => {
    return useMutation({
      mutationFn: (tutorId: string) => tutorService.removeFromFavorites(tutorId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.favoriteTutors() })
      },
    })
  }

  // Получить статистику репетитора
  const getTutorStats = () => {
    return useQuery({
      queryKey: queryKeys.tutorStats(),
      queryFn: () => tutorService.getStats(),
      refetchInterval: 10000, // Автообновление каждые 10 секунд
    })
  }

  return {
    searchTutors,
    getTutor,
    getFavoriteTutors,
    getPopularTutors,
    addToFavorites,
    removeFromFavorites,
    getTutorStats,
  }
}
