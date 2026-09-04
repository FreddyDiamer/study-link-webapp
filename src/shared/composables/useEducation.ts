import { computed } from 'vue'
import { useEducationStore } from '@/stores'

export const useEducation = () => {
  const educationStore = useEducationStore()

  // Computed properties для удобного доступа
  const subjects = computed(() => educationStore.subjects)
  const activeSubjects = computed(() => educationStore.activeSubjects)
  const teachers = computed(() => educationStore.teachers)
  const groups = computed(() => educationStore.groups)
  const isLoading = computed(() => educationStore.isLoading)
  const error = computed(() => educationStore.error)
  const isInitialized = computed(() => educationStore.isInitialized)

  // Методы для работы с данными
  const getSubjectById = (id: string) => educationStore.getSubjectById(id)
  const getTeacherById = (id: string) => educationStore.getTeacherById(id)
  const getTeachersBySubject = (subjectId: string) => educationStore.getTeachersBySubject(subjectId)
  const getSubjectsByTeacher = (teacherId: string) => educationStore.getSubjectsByTeacher(teacherId)

  // Методы управления
  const initialize = () => educationStore.initialize()
  const refresh = () => educationStore.refresh()
  const clear = () => educationStore.clear()

  return {
    // State
    subjects,
    activeSubjects,
    teachers,
    groups,
    isLoading,
    error,
    isInitialized,

    // Methods
    getSubjectById,
    getTeacherById,
    getTeachersBySubject,
    getSubjectsByTeacher,
    initialize,
    refresh,
    clear,

    // Store access (для продвинутых случаев)
    store: educationStore,
  }
}
