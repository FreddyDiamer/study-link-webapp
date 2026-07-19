import { educationApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type { Subject, Teacher, TeacherSubject } from '@/shared/types'

export class EducationService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getSubjects(): Promise<Subject[]> {
    try {
      return await educationApi.getSubjects()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении предметов')
      throw error
    }
  }

  async getTeachers(): Promise<Teacher[]> {
    try {
      return await educationApi.getTeachers()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении преподавателей')
      throw error
    }
  }

  async getTeacherSubjects(): Promise<TeacherSubject[]> {
    try {
      return await educationApi.getTeacherSubjects()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении связей преподаватель-предмет')
      throw error
    }
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
