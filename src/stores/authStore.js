import { defineStore } from 'pinia'
import { loginUser, logoutUser, getCurrentUser } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role,
  },

  actions: {
    async login(nama_pengguna, password) {
      this.loading = true
      this.error = null
      try {
        const response = await loginUser({ nama_pengguna, password })

        if (!response.data?.token || !response.data?.user) {
          throw new Error('Invalid response format')
        }

        this.token = response.data.token
        this.user = response.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        if (response.data.expires_at) {
          localStorage.setItem('token_expires_at', response.data.expires_at)
        }

        this.error = null
      } catch (err) {
        this.clearAuth()

        if (err.response?.status === 401) {
          this.error = 'Nama pengguna atau kata sandi salah'
        } else if (err.response?.status === 422) {
          this.error = 'Data yang dikirim tidak valid'
        } else if (err.response?.status === 429) {
          this.error = 'Terlalu banyak percobaan login. Coba lagi nanti'
        } else if (!navigator.onLine) {
          this.error = 'Tidak ada koneksi internet'
        } else {
          this.error = err.response?.data?.message || 'Terjadi kesalahan server'
        }

        console.error('Login error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async refreshUser() {
      if (!this.token) return
      try {
        const response = await getCurrentUser()
        if (!response.data) throw new Error('User data not found')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        console.error('Refresh user error:', err)
      }
    },

    async logout() {
      try {
        if (this.token) {
          await logoutUser()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expires_at')
    },

    checkTokenExpiration() {
      const expiresAt = localStorage.getItem('token_expires_at')
      if (expiresAt && new Date() > new Date(expiresAt)) {
        this.clearAuth()
        return false
      }
      return true
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        if (this.checkTokenExpiration()) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },
  },
})
