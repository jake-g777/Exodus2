import axios from 'axios'
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    const { accessToken } = JSON.parse(auth)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const auth = localStorage.getItem('auth')
      if (auth) {
        const { refreshToken } = JSON.parse(auth)
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            })
            const { accessToken } = response.data.data

            // Update stored auth
            const updatedAuth = { ...JSON.parse(auth), accessToken }
            localStorage.setItem('auth', JSON.stringify(updatedAuth))

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('auth')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data
  },

  register: async (userData: RegisterRequest): Promise<{ userId: string; email: string; firstName: string; lastName: string; role: string }> => {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },

  logout: async (data: { refreshToken: string }): Promise<void> => {
    await api.post('/auth/logout', data)
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data.data
  },
} 