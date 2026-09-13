import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/shared/constants'
import type { ApiResponse } from '@/shared/types'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - добавляем токен
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor - обработка ошибок
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Очищаем токен при 401
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          // экрана «/auth» нет: App.vue заново логинит по initData при загрузке
          window.location.href = '/'
        }
        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, { params })
    return response.data.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data)
    return response.data.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data)
    return response.data.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data)
    return response.data.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url)
    return response.data.data
  }
}

export const apiClient = new ApiClient()
