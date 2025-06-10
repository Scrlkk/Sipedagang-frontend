import api from '@/services/authService'

export const createPengadaan = (data) => {
  return api.post('/pengadaan', data)
}

// ✅ Update untuk backend pagination
export const getPengadaan = (
  page = 1,
  perPage = 10,
  search = '',
  bulan = '',
) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('per_page', perPage) // ✅ Tambah per_page
  if (search) params.append('search', search)
  if (bulan) params.append('bulan', bulan)
  return api.get(`/pengadaan?${params.toString()}`)
}

export const getPengadaanById = (id) => {
  return api.get(`/pengadaan/${id}`)
}

export const updatePengadaan = (id, data) => {
  return api.put(`/pengadaan/${id}`, data)
}

export const deletePengadaan = (id) => {
  return api.delete(`/pengadaan/${id}`)
}
