import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '@/services/business'
import { queryKeys } from '@/shared/lib/query-keys'
import type { User } from '@/shared/types'

export const useUser = () => {
  const queryClient = useQueryClient()

  // Получить профиль текущего пользователя (/users/me)
  const getProfile = () => {
    return useQuery({
      queryKey: queryKeys.userProfile(),
      queryFn: () => userService.getProfile(),
      refetchInterval: 30000, // Автообновление каждые 30 секунд
      refetchIntervalInBackground: true, // Обновлять и при неактивной вкладке
    })
  }

  // Обновить профиль
  const updateProfile = () => {
    return useMutation({
      mutationFn: (data: Partial<User>) => userService.updateProfile(data),
      onSuccess: () => {
        // Инвалидируем кэш профиля после обновления
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile() })
      },
    })
  }

  // Обновить группу пользователя
  const updateGroup = () => {
    return useMutation({
      mutationFn: (groupId: string) => userService.updateGroup(groupId),
      onSuccess: () => {
        // Инвалидируем кэш профиля после обновления группы
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile() })
      },
    })
  }

  return {
    getProfile,
    updateProfile,
    updateGroup,
  }
}
