import { defineStore } from 'pinia'
import {
  createPengadaan,
  getPengadaan,
  getPengadaanById,
  updatePengadaan,
  deletePengadaan,
} from '@/services/pengadaanService'

export const usePengadaanStore = defineStore('pengadaan', {
  state: () => ({
    pengadaanList: [],
    currentPengadaan: null,
    loading: false,
    error: null,
    success: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
      from: 0,
      to: 0,
    },
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasSuccess: (state) => !!state.success,
    totalPages: (state) => state.pagination.lastPage,
    currentPageData: (state) => state.pagination.currentPage,
    totalItems: (state) => state.pagination.total,
  },

  actions: {
    clearMessages() {
      this.error = null
      this.success = null
    },

    handleError(error, defaultMessage = 'Terjadi kesalahan') {
      // Extract detailed error information for debugging
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        if (errors) {
          // Format validation errors
          const errorMessages = Object.values(errors).flat()
          this.error = errorMessages.join(', ')
        } else {
          this.error = error.response.data.message || 'Validation failed'
        }
      } else {
        this.error =
          error.response?.data?.message || error.message || defaultMessage
      }
    },

    async createPengadaan(formData) {
      this.loading = true
      this.error = null

      try {
        const response = await createPengadaan(formData)
        this.success = 'Data pengadaan berhasil disimpan'

        await this.fetchPengadaan(1, 10)

        return response.data
      } catch (err) {
        this.handleError(err, 'Gagal menyimpan data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchPengadaan(page = 1, perPage = 10, search = '', bulan = '') {
      this.loading = true
      this.error = null

      try {
        const response = await getPengadaan(page, perPage, search, bulan)

        this.pengadaanList = response.data.data || []

        this.pagination = {
          currentPage: response.data.current_page || page,
          lastPage: response.data.last_page || 1,
          perPage: response.data.per_page || perPage,
          total: response.data.total || 0,
          from: response.data.from || 0,
          to: response.data.to || 0,
        }

        return response.data
      } catch (err) {
        this.handleError(err, 'Gagal mengambil data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchPengadaanById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await getPengadaanById(id)

        this.currentPengadaan = response.data.data || response.data

        return this.currentPengadaan
      } catch (err) {
        this.handleError(err, 'Gagal mengambil detail pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePengadaan(id, formData) {
      this.loading = true
      this.error = null

      try {
        const response = await updatePengadaan(id, formData)

        this.success = 'Data pengadaan berhasil diperbarui'

        await this.fetchPengadaan(
          this.pagination.currentPage,
          this.pagination.perPage,
        )

        this.currentPengadaan = response.data.data || response.data

        return response.data
      } catch (err) {
        this.handleError(err, 'Gagal memperbarui data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },

    async deletePengadaan(id) {
      this.loading = true
      this.error = null

      try {
        const response = await deletePengadaan(id)

        this.success = 'Data pengadaan berhasil dihapus'

        await this.fetchPengadaan(
          this.pagination.currentPage,
          this.pagination.perPage,
        )

        return response.data
      } catch (err) {
        this.handleError(err, 'Gagal menghapus data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
