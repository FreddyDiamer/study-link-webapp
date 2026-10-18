import { educationApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type { Group, GroupSubject, SubjectOption, TeacherOption } from '@/shared/types'

/**
 * Справочник. Методы выбора предмета и преподавателя — без алерта: их сбой лист выбора
 * показывает сам, у своего поля, а модальный алерт поверх был бы дублем.
 */
export class EducationService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getGroups(): Promise<Group[]> {
    try {
      return await educationApi.getGroups()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении групп')
      throw error
    }
  }

  getGroupSubjects(groupId: string): Promise<GroupSubject[]> {
    return educationApi.getGroupSubjects(groupId)
  }

  searchSubjects(search: string): Promise<SubjectOption[]> {
    return educationApi.searchSubjects(search)
  }

  searchTeachers(search: string): Promise<TeacherOption[]> {
    return educationApi.searchTeachers(search)
  }

  async getTeachersBySubject(subjectId: string): Promise<TeacherOption[]> {
    const response = await educationApi.getTeachersBySubject(subjectId)
    return response?.items ?? []
  }

  async getSubjectsByTeacher(teacherId: string): Promise<SubjectOption[]> {
    const response = await educationApi.getSubjectsByTeacher(teacherId)
    return (response?.items ?? []).map((link) => link.subject)
  }

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 404) {
      message = 'Данные не найдены'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const educationService = new EducationService()
