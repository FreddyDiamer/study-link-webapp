import { apiClient } from './client'
import type { Subject, Teacher, TeacherSubject, Group } from '@/shared/types'

export const educationApi = {
  // =============================================================================
  // SUBJECTS
  // =============================================================================

  getSubjects(): Promise<Subject[]> {
    return apiClient.get('/education/subjects')
  },

  // =============================================================================
  // TEACHERS
  // =============================================================================

  getTeachers(): Promise<Teacher[]> {
    return apiClient.get('/education/teachers')
  },

  // =============================================================================
  // TEACHER SUBJECTS
  // =============================================================================

  getTeacherSubjects(): Promise<TeacherSubject[]> {
    return apiClient.get('/education/teacher-subjects')
  },

  // =============================================================================
  // GROUPS
  // =============================================================================

  getGroups(): Promise<Group[]> {
    return apiClient.get('/education/groups')
  },

  createGroup(data: { number: string }): Promise<Group> {
    return apiClient.post('/education/groups', data)
  },

  deleteGroup(id: string): Promise<void> {
    return apiClient.delete(`/education/groups/${id}`)
  },
}
