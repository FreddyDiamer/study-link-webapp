import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { educationService } from '@/services/business'
import type { Group, Subject, Teacher, TeacherSubject } from '@/shared/types'

export const useEducationStore = defineStore('education', () => {
  // State
  const subjects = ref<Subject[]>([])
  const teachers = ref<Teacher[]>([])
  const teacherSubjects = ref<TeacherSubject[]>([])
  const groups = ref<Group[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const activeSubjects = computed(() => subjects.value.filter((subject) => subject.isActive))

  const subjectsWithTeachers = computed(() => {
    return activeSubjects.value.map((subject) => ({
      ...subject,
      teachers: teacherSubjects.value
        .filter((ts) => ts.subjectId === subject.id && ts.isActive)
        .map((ts) => ts.teacher),
    }))
  })

  const teachersWithSubjects = computed(() => {
    return teachers.value.map((teacher) => ({
      ...teacher,
      subjects: teacherSubjects.value
        .filter((ts) => ts.teacherId === teacher.id && ts.isActive)
        .map((ts) => ts.subject),
    }))
  })

  const getSubjectById = computed(
    () => (id: string) => subjects.value.find((subject) => subject.id === id),
  )

  const getTeacherById = computed(
    () => (id: string) => teachers.value.find((teacher) => teacher.id === id),
  )

  const getTeachersBySubject = computed(
    () => (subjectId: string) =>
      teacherSubjects.value
        .filter((ts) => ts.subjectId === subjectId && ts.isActive)
        .map((ts) => ts.teacher),
  )

  const getSubjectsByTeacher = computed(
    () => (teacherId: string) =>
      teacherSubjects.value
        .filter((ts) => ts.teacherId === teacherId && ts.isActive)
        .map((ts) => ts.subject),
  )

  // Actions
  const initialize = async () => {
    if (isInitialized.value) return

    isLoading.value = true
    error.value = null

    try {
      await Promise.all([loadSubjects(), loadTeachers(), loadTeacherSubjects(), loadGroups()])

      isInitialized.value = true
    } catch (err: any) {
      error.value = err.message
      console.error('Ошибка инициализации образовательных данных:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadSubjects = async () => {
    try {
      subjects.value = await educationService.getSubjects()
    } catch (err: any) {
      console.error('Ошибка загрузки предметов:', err)
      throw err
    }
  }

  const loadTeachers = async () => {
    try {
      teachers.value = await educationService.getTeachers()
    } catch (err: any) {
      console.error('Ошибка загрузки преподавателей:', err)
      throw err
    }
  }

  const loadTeacherSubjects = async () => {
    try {
      teacherSubjects.value = await educationService.getTeacherSubjects()
    } catch (err: any) {
      console.error('Ошибка загрузки связей преподаватель-предмет:', err)
      throw err
    }
  }

  const loadGroups = async () => {
    try {
      groups.value = await educationService.getGroups()
    } catch (err: any) {
      console.error('Ошибка загрузки групп:', err)
      throw err
    }
  }

  const refresh = async () => {
    isInitialized.value = false
    await initialize()
  }

  const clear = () => {
    subjects.value = []
    teachers.value = []
    teacherSubjects.value = []
    groups.value = []
    isLoading.value = false
    error.value = null
    isInitialized.value = false
  }

  return {
    // State
    subjects,
    teachers,
    teacherSubjects,
    groups,
    isLoading,
    error,
    isInitialized,

    // Getters
    activeSubjects,
    subjectsWithTeachers,
    teachersWithSubjects,
    getSubjectById,
    getTeacherById,
    getTeachersBySubject,
    getSubjectsByTeacher,

    // Actions
    initialize,
    loadSubjects,
    loadTeachers,
    loadTeacherSubjects,
    loadGroups,
    refresh,
    clear,
  }
})
