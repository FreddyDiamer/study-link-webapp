import { apiClient } from './client'
import type { Subject, Teacher, TeacherSubject } from '@/shared/types'

export const educationApi = {
  // =============================================================================
  // SUBJECTS
  // =============================================================================

  // Получить все предметы
  getSubjects: () => apiClient.get<Subject[]>('/education/subjects'),

  // Получить активные предметы
  getActiveSubjects: () => apiClient.get<Subject[]>('/education/subjects/active'),

  // Получить предмет по ID
  getSubject: (id: string) => apiClient.get<Subject>(`/education/subjects/${id}`),

  // =============================================================================
  // TEACHERS
  // =============================================================================

  // Получить всех преподавателей
  getTeachers: () => apiClient.get<Teacher[]>('/education/teachers'),

  // Получить преподавателя по ID
  getTeacher: (id: string) => apiClient.get<Teacher>(`/education/teachers/${id}`),

  // =============================================================================
  // TEACHER SUBJECTS
  // =============================================================================

  // Получить связи преподаватель-предмет
  getTeacherSubjects: () => apiClient.get<TeacherSubject[]>('/education/teacher-subjects'),

  // Получить предметы преподавателя
  getTeacherSubjectsByTeacher: (teacherId: string) =>
    apiClient.get<TeacherSubject[]>(`/education/teacher-subjects/by-teacher/${teacherId}`),

  // Получить преподавателей предмета
  getTeacherSubjectsBySubject: (subjectId: string) =>
    apiClient.get<TeacherSubject[]>(`/education/teacher-subjects/by-subject/${subjectId}`),
}
