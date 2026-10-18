import { computed, readonly, ref, watch } from 'vue'
import { educationService } from '@/services/business'
import { useAuthStore } from '@/stores'
import type { GroupSubject } from '@/shared/types'

// расписание группы почти не меняется — один запрос на группу на всё время жизни приложения
const cache = new Map<string, Promise<GroupSubject[]>>()

const fetchGroupSubjects = (groupId: string) => {
  let pending = cache.get(groupId)
  if (!pending) {
    pending = educationService.getGroupSubjects(groupId)
    // упавший запрос не кэшируем: следующий экран попробует снова
    pending.catch(() => cache.delete(groupId))
    cache.set(groupId, pending)
  }
  return pending
}

/**
 * Предметы расписания группы текущего пользователя, у каждого — преподаватели этой группы.
 * Нет группы или расписания — пустой список: выбор тогда держится на поиске по всем.
 */
export const useMyGroupSubjects = () => {
  const auth = useAuthStore()

  const subjects = ref<GroupSubject[]>([])
  const isLoading = ref(false)

  const groupId = computed(() => auth.user?.groupId ?? '')
  const hasGroup = computed(() => !!groupId.value)

  // ответ старой группы, пришедший после смены, не должен перетереть новую
  let current = ''

  const load = async (id: string) => {
    current = id
    if (!id) {
      subjects.value = []
      return
    }
    isLoading.value = true
    try {
      const result = await fetchGroupSubjects(id)
      if (current === id) subjects.value = result
    } catch (e) {
      console.error('Не удалось загрузить предметы группы:', e)
      if (current === id) subjects.value = []
    } finally {
      if (current === id) isLoading.value = false
    }
  }

  watch(groupId, load, { immediate: true })

  return {
    // State
    subjects: readonly(subjects),
    isLoading: readonly(isLoading),
    hasGroup,
  }
}
