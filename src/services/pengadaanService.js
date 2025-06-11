import api from '@/services/authService'

export const createPengadaan = (data) => {
  return api.post('/pengadaan', data)
}

// ✅ Perbaiki parameter bulan
export const getPengadaan = (
  page = 1,
  perPage = 10,
  search = '',
  bulan = '',
) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('per_page', perPage)

  // ✅ Hanya tambah parameter jika ada nilainya
  if (search && search.trim()) {
    params.append('search', search.trim())
  }

  if (bulan && bulan.trim()) {
    params.append('bulan', bulan.trim())
    console.log('Sending bulan parameter:', bulan.trim()) // Debug log
  }

  const url = `/pengadaan?${params.toString()}`
  console.log('Final API URL:', url) // Debug log

  return api.get(url)
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
