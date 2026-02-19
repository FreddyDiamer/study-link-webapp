import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTutor } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import type { User } from '../models'

export function useFavorites() {
  const router = useRouter()
  const { getFavoriteTutors, removeFromFavorites } = useTutor()

  const favorites = ref<User[]>([])
  const isLoading = ref(false)

  const loadFavorites = async () => {
    isLoading.value = true
    try {
      const response = await getFavoriteTutors()
      favorites.value = response?.items || []
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleRemoveFavorite = async (tutorId: string) => {
    try {
      await removeFromFavorites(tutorId)
      await loadFavorites()
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error)
    }
  }

  const goToTutorsList = () => {
    router.push(PATHS.STUDENT_TUTORS)
  }

  onMounted(() => {
    loadFavorites()
  })

  return {
    favorites,
    isLoading,
    loadFavorites,
    handleRemoveFavorite,
    goToTutorsList,
  }
}
