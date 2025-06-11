import api from '@/services/authService'

export const createPengadaan = (data) => {
  return api.post('/pengadaan', data)
}

export const getPengadaan = (
  page = 1,
  perPage = 10,
  search = '',
  bulan = '',
) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('per_page', perPage)

  if (search && search.trim()) {
    params.append('search', search.trim())
  }

  if (bulan && bulan.trim()) {
    params.append('bulan', bulan.trim())
  }

  const url = `/pengadaan?${params.toString()}`

  return api.get(url)
}

export const getPengadaanById = (id) => {
  return api.get(`/pengadaan/${id}`)
}

export const updatePengadaan = (id, data) => {
  const formData = new FormData()

  // Handle different data types
  if (data instanceof FormData) {
    // If already FormData, copy all entries
    for (let [key, value] of data.entries()) {
      formData.append(key, value)
    }
  } else {
    // If regular object, append each property
    Object.keys(data).forEach((key) => {
      const value = data[key]
      if (value !== null && value !== undefined) {
        // Handle arrays (like detail_pengadaan)
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              Object.keys(item).forEach((subKey) => {
                formData.append(`${key}[${index}][${subKey}]`, item[subKey])
              })
            } else {
              formData.append(`${key}[${index}]`, item)
            }
          })
        } else if (typeof value === 'object' && !(value instanceof File)) {
          // Handle nested objects
          Object.keys(value).forEach((subKey) => {
            formData.append(`${key}[${subKey}]`, value[subKey])
          })
        } else {
          // Handle primitive values and files
          formData.append(key, value)
        }
      }
    })
  }

  // Add method override for Laravel
  formData.append('_method', 'PUT')

  return api.post(`/pengadaan/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deletePengadaan = (id) => {
  const formData = new FormData()
  formData.append('_method', 'DELETE')

  return api.post(`/pengadaan/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
