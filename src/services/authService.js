import axios from 'axios'
import { config } from '@/config/env'

const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expires_at')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const loginUser = (credentials) => {
  return api.post('/login', {
    nama_pengguna: credentials.nama_pengguna,
    password: credentials.password,
  })
}

export const logoutUser = () => {
  return api.post('/logout')
}

export const refreshToken = () => {
  return api.post('/refresh')
}

export const getCurrentUser = () => {
  return api.get('/user')
}

export default api
