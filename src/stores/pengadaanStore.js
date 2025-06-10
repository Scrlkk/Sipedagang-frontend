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
    // ✅ Tambah pagination data dari backend
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
    // ✅ Getter untuk pagination
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
      console.error('Store error:', error)
      this.error =
        error.response?.data?.message || error.message || defaultMessage
    },

    async createPengadaan(formData) {
      this.loading = true
      this.error = null

      try {
        const response = await createPengadaan(formData)
        this.success = 'Data pengadaan berhasil disimpan'

        // ✅ Refresh dengan pagination
        await this.fetchPengadaan(1, 10)

        return response.data
      } catch (err) {
        this.handleError(err, 'Gagal menyimpan data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },

    // ✅ Update fetchPengadaan untuk backend pagination
    async fetchPengadaan(page = 1, perPage = 10, search = '', bulan = '') {
      this.loading = true
      this.error = null

      try {
        console.log('Fetching data:', { page, perPage, search, bulan })
        const response = await getPengadaan(page, perPage, search, bulan)
        console.log('Backend response:', response.data)

        // ✅ Set data dari backend
        this.pengadaanList = response.data.data || []

        // ✅ Set pagination info dari backend
        this.pagination = {
          currentPage: response.data.current_page || page,
          lastPage: response.data.last_page || 1,
          perPage: response.data.per_page || perPage,
          total: response.data.total || 0,
          from: response.data.from || 0,
          to: response.data.to || 0,
        }

        console.log('Updated pagination:', this.pagination)
        return response.data
      } catch (err) {
        console.error('Fetch error:', err)
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
        console.log('Store: Fetching pengadaan by ID:', id)
        const response = await getPengadaanById(id)
        console.log('Store: API response:', response)

        this.currentPengadaan = response.data.data || response.data
        console.log('Store: Set currentPengadaan:', this.currentPengadaan)

        return this.currentPengadaan
      } catch (err) {
        console.error('Store: Error in fetchPengadaanById:', err)
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
        console.log('Store: Updating pengadaan:', id, formData)
        const response = await updatePengadaan(id, formData)
        console.log('Store: Update response:', response)

        this.success = 'Data pengadaan berhasil diperbarui'

        // ✅ Refresh dengan pagination
        await this.fetchPengadaan(
          this.pagination.currentPage,
          this.pagination.perPage,
        )

        this.currentPengadaan = response.data.data || response.data

        return response.data
      } catch (err) {
        console.error('Store: Error in updatePengadaan:', err)
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
        console.log('Store: Deleting pengadaan:', id)
        const response = await deletePengadaan(id)
        console.log('Store: Delete response:', response)

        this.success = 'Data pengadaan berhasil dihapus'

        // ✅ Refresh dengan pagination
        await this.fetchPengadaan(
          this.pagination.currentPage,
          this.pagination.perPage,
        )

        return response.data
      } catch (err) {
        console.error('Store: Error in deletePengadaan:', err)
        this.handleError(err, 'Gagal menghapus data pengadaan')
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
