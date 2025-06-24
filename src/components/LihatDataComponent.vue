<script setup>
  import { useRouter } from 'vue-router'
  import { computed, watch } from 'vue'

  const props = defineProps({
    tableData: { type: Array, default: () => [] },
    searchQuery: { type: String, default: '' },
    selectedMonth: { type: String, default: '' },
    currentPage: { type: Number, default: 1 },
    itemsPerPage: { type: Number, default: 10 },
    pageInput: { type: Number, default: 1 },
    months: { type: Array, default: () => [] },
    filteredData: { type: Array, default: () => [] },
    paginatedData: { type: Array, default: () => [] },
    getTotalPages: { type: Number, default: 1 },
    isExtraSmallScreen: { type: Boolean, default: false },
    displayedPageNumbers: { type: Array, default: () => [] },
    userType: { type: String, default: 'admin' },
  })

  const emit = defineEmits([
    'back',
    'preview',
    'print',
    'edit',
    'delete',
    'update:searchQuery',
    'update:selectedMonth',
    'update:currentPage',
    'update:pageInput',
    'page-input-submit',
  ])

  const router = useRouter()

  // ✅ Helper function untuk mendapatkan nama bulan dalam bahasa Indonesia
  const getMonthName = (monthNumber) => {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    return months[monthNumber - 1] || ''
  }

  // ✅ Helper function untuk ekstrak bulan dari tanggal
  const extractMonth = (dateString) => {
    if (!dateString) return null

    try {
      // Format yang mungkin: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, etc.
      let date

      if (dateString.includes('/')) {
        // Format DD/MM/YYYY
        const parts = dateString.split('/')
        if (parts.length === 3) {
          date = new Date(parts[2], parts[1] - 1, parts[0])
        }
      } else if (dateString.includes('-')) {
        // Format YYYY-MM-DD atau DD-MM-YYYY
        const parts = dateString.split('-')
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // YYYY-MM-DD
            date = new Date(parts[0], parts[1] - 1, parts[2])
          } else {
            // DD-MM-YYYY
            date = new Date(parts[2], parts[1] - 1, parts[0])
          }
        }
      } else {
        date = new Date(dateString)
      }

      return date.getMonth() + 1 // Return 1-12
    } catch (error) {
      console.warn('Error parsing date:', dateString, error)
      return null
    }
  }

  // ✅ Computed untuk daftar bulan yang tersedia
  const availableMonths = computed(() => {
    const monthsSet = new Set()

    // Tambahkan opsi "Semua Bulan"
    const months = [{ value: '', label: 'Semua Bulan' }]

    // Ekstrak bulan dari data
    props.tableData.forEach((item) => {
      const tanggal = getItemValue(item, 'tanggal')
      if (tanggal && tanggal !== 'N/A') {
        const monthNumber = extractMonth(tanggal)
        if (monthNumber && monthNumber >= 1 && monthNumber <= 12) {
          monthsSet.add(monthNumber)
        }
      }
    })

    // Convert Set ke Array dan sort
    const sortedMonths = Array.from(monthsSet).sort((a, b) => a - b)

    // Tambahkan ke daftar bulan
    sortedMonths.forEach((monthNumber) => {
      months.push({
        value: monthNumber.toString(),
        label: getMonthName(monthNumber),
      })
    })

    return months
  })

  // ✅ Computed untuk data yang difilter
  const computedFilteredData = computed(() => {
    let filtered = [...props.tableData]

    // Filter berdasarkan search query
    if (props.searchQuery && props.searchQuery.trim()) {
      const query = props.searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const jenisPengadaan = getItemValue(
          item,
          'jenis_pengadaan',
        ).toLowerCase()
        const noPreorder = getItemValue(item, 'no_preorder').toLowerCase()
        const supplier = getItemValue(item, 'supplier').toLowerCase()
        const perusahaan = getItemValue(item, 'perusahaan').toLowerCase()
        const kuantum = getItemValue(item, 'kuantum').toLowerCase()
        const tanggal = getItemValue(item, 'tanggal').toLowerCase()

        return (
          jenisPengadaan.includes(query) ||
          noPreorder.includes(query) ||
          supplier.includes(query) ||
          perusahaan.includes(query) ||
          kuantum.includes(query) ||
          tanggal.includes(query)
        )
      })
    }

    // Filter berdasarkan bulan yang dipilih
    if (props.selectedMonth && props.selectedMonth.trim()) {
      const selectedMonthNumber = parseInt(props.selectedMonth)
      filtered = filtered.filter((item) => {
        const tanggal = getItemValue(item, 'tanggal')
        if (tanggal && tanggal !== 'N/A') {
          const itemMonth = extractMonth(tanggal)
          return itemMonth === selectedMonthNumber
        }
        return false
      })
    }

    return filtered
  })

  // ✅ Computed untuk data dengan pagination
  const computedPaginatedData = computed(() => {
    const startIndex = (props.currentPage - 1) * props.itemsPerPage
    const endIndex = startIndex + props.itemsPerPage
    return computedFilteredData.value.slice(startIndex, endIndex)
  })

  // ✅ Computed untuk total halaman
  const computedTotalPages = computed(() => {
    return (
      Math.ceil(computedFilteredData.value.length / props.itemsPerPage) || 1
    )
  })

  // Helper functions tetap sama...
  const capitalizeText = (text) => {
    if (!text) return ''
    const str = String(text)
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const titleCaseText = (text) => {
    if (!text) return ''
    const str = String(text)
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getItemValue = (item, field) => {
    let value = ''

    switch (field) {
      case 'jenis_pengadaan':
        value =
          item.jenisPengadaan ||
          item.rawData?.jenis_pengadaan_barang ||
          item.jenis_pengadaan_barang ||
          'N/A'
        return titleCaseText(value)

      case 'no_preorder':
        return (
          item.noProorder ||
          item.rawData?.no_preorder ||
          item.no_preorder ||
          'N/A'
        )

      case 'supplier':
        value =
          item.supplier ||
          item.rawData?.nama_suplier ||
          item.nama_suplier ||
          'N/A'
        return titleCaseText(value)

      case 'perusahaan':
        value =
          item.perusahaan ||
          item.rawData?.nama_perusahaan ||
          item.nama_perusahaan ||
          'N/A'
        return titleCaseText(value)

      case 'kuantum':
        return item.kuantum || item.rawData?.kuantum || 'N/A'

      case 'tanggal':
        return (
          item.tanggal ||
          item.rawData?.tanggal_pengadaan ||
          item.tanggal_pengadaan ||
          'N/A'
        )

      case 'id':
        return item.id || item.rawData?.id

      default:
        return 'N/A'
    }
  }

  // Event handlers...
  const goBack = () => {
    emit('back')
  }

  const previewItem = (item) => {
    emit('preview', item)
  }

  const printItem = (item) => {
    emit('print', item)
    window.open(`/surat-preview/${getItemValue(item, 'id')}`, '_blank')
  }

  const editItem = (item) => {
    emit('edit', item)
  }

  const deleteItem = (item) => {
    emit('delete', item)
  }

  const resetFilters = () => {
    emit('update:searchQuery', '')
    emit('update:selectedMonth', '')
    emit('update:currentPage', 1)
  }

  // ✅ Pagination handlers
  const goToPage = (page) => {
    if (
      page >= 1 &&
      page <= computedTotalPages.value &&
      page !== props.currentPage
    ) {
      emit('update:currentPage', page)
    }
  }

  const nextPage = () => {
    if (props.currentPage < computedTotalPages.value) {
      emit('update:currentPage', props.currentPage + 1)
    }
  }

  const prevPage = () => {
    if (props.currentPage > 1) {
      emit('update:currentPage', props.currentPage - 1)
    }
  }

  // ✅ Computed untuk page numbers yang akan ditampilkan
  const visiblePageNumbers = computed(() => {
    const total = computedTotalPages.value
    const current = props.currentPage
    const pages = []

    if (total <= 5) {
      // Jika total halaman <= 5, tampilkan semua
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Jika total halaman > 5, tampilkan dengan logika
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5)
      } else if (current >= total - 2) {
        pages.push(total - 4, total - 3, total - 2, total - 1, total)
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2)
      }
    }

    return pages
  })
</script>

<template>
  <!-- Modern Container -->
  <div class="p-2 sm:p-4 lg:p-6">
    <!-- Main Content Card -->
    <div class="max-w-8xl mx-auto">
      <div class="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <!-- Modern Header with Glassmorphism Effect -->
        <div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <!-- Decorative Elements -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>          <!-- Header Content -->
          <div class="relative z-10">
            <!-- Back Button at Top (Mobile Only) -->
            <div class="mb-4 lg:hidden">
              <router-link
                to="/admin/dashboard"
                @click.native="goBack"
                class="inline-flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm text-white/90 font-medium rounded-lg border border-white/30 hover:bg-white/30 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </router-link>
            </div>
            
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              <!-- Modern Title -->
              <div class="flex items-center space-x-4">
                <div class="p-3 sm:p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 sm:h-8 sm:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {{ userType === 'admin' ? 'Lihat Data' : 'Rekap Data' }}
                  </h1>
                  <p class="text-white/80 text-sm sm:text-base">
                    Kelola dan pantau data pengadaan dengan mudah
                  </p>
                </div>
              </div>

              <!-- Modern Search & Filter Section -->
              <div class="w-full lg:w-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <!-- Enhanced Search Input -->
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        class="h-5 w-5 text-white/60 group-focus-within:text-white transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      :value="searchQuery"
                      placeholder="Cari data pengadaan..."
                      class="w-full pl-12 pr-12 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                      @input="$emit('update:searchQuery', $event.target.value)"
                    />
                    <button
                      v-if="searchQuery"
                      @click="$emit('update:searchQuery', '')"
                      class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Enhanced Month Filter -->
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        class="h-5 w-5 text-white/60 group-focus-within:text-white transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <select
                      :value="selectedMonth"
                      @change="$emit('update:selectedMonth', $event.target.value)"
                      class="w-full pl-12 pr-12 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option v-for="month in availableMonths" :key="month.value" :value="month.value" class="text-gray-900">
                        {{ month.label }}
                      </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Filter Badges -->
                <div
                  v-if="searchQuery || selectedMonth"
                  class="flex flex-wrap items-center mt-4 gap-2"
                >
                  <!-- Search Badge -->
                  <div
                    v-if="searchQuery"
                    class="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full flex items-center border border-white/30 shadow-lg animate-fadeIn"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{{ searchQuery }}</span>
                    <button
                      @click="$emit('update:searchQuery', '')"
                      class="ml-2 text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Month Badge -->
                  <div
                    v-if="selectedMonth"
                    class="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full flex items-center border border-white/30 shadow-lg animate-fadeIn"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ availableMonths.find(m => m.value === selectedMonth)?.label }}</span>
                    <button
                      @click="$emit('update:selectedMonth', '')"
                      class="ml-2 text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Results Count -->
                  <div class="bg-white/30 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full border border-white/40 shadow-lg">
                    {{ computedFilteredData.length }} hasil
                  </div>

                  <!-- Reset Button -->
                  <button
                    @click="resetFilters"
                    class="bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Table Container -->
        <div class="flex-1 overflow-hidden">
          <!-- Mobile Card View (visible on small screens) -->
          <div class="block lg:hidden p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-fancy">
            <div
              v-for="(item, index) in computedPaginatedData"
              :key="index"
              class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <!-- Card Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg">{{ getItemValue(item, 'jenis_pengadaan') }}</h3>
                    <p class="text-sm text-gray-500">{{ getItemValue(item, 'no_preorder') }}</p>                  </div>
                </div>
                <div class="flex space-x-2">
                  <!-- Mobile Action Buttons -->
                  <button
                    @click="printItem(item)"
                    class="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors duration-200"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button
                    @click="editItem(item)"
                    class="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors duration-200"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteItem(item)"
                    class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Card Content -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 block">Supplier:</span>
                  <span class="font-medium text-gray-900">{{ getItemValue(item, 'supplier') }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">Perusahaan:</span>
                  <span class="font-medium text-gray-900">{{ getItemValue(item, 'perusahaan') }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">Kuantum:</span>
                  <span class="font-medium text-gray-900">{{ getItemValue(item, 'kuantum') }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">Tanggal:</span>
                  <span class="font-medium text-gray-900">{{ getItemValue(item, 'tanggal') }}</span>
                </div>
              </div>
            </div>

            <!-- Empty State for Mobile -->
            <div v-if="computedPaginatedData.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-gray-500 text-lg font-medium">Tidak ada data</p>
              <p class="text-gray-400 text-sm mt-1">Data yang Anda cari tidak ditemukan</p>
            </div>
          </div>

          <!-- Desktop Table View (hidden on small screens) -->
          <div class="hidden lg:block overflow-x-auto scrollbar-fancy">
            <table class="min-w-full">
              <!-- Modern Table Header -->
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                      </svg>
                      <span>Jenis Pengadaan</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span>No. Preorder</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Supplier</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Perusahaan</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Kuantum</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Tanggal</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div class="flex items-center justify-center space-x-2">
                      <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      <span>Aksi</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <!-- Table Body -->
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in computedPaginatedData"
                  :key="index"
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-sm font-bold text-gray-900">{{ getItemValue(item, 'jenis_pengadaan') }}</div>
                        <div class="text-sm text-gray-500">Pengadaan</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ getItemValue(item, 'no_preorder') }}</div>
                    <div class="text-sm text-gray-500">No. Order</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ getItemValue(item, 'supplier') }}</div>
                    <div class="text-sm text-gray-500">Nama Supplier</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ getItemValue(item, 'perusahaan') }}</div>
                    <div class="text-sm text-gray-500">Nama Perusahaan</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {{ getItemValue(item, 'kuantum') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg class="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-900">{{ getItemValue(item, 'tanggal') }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">                    <div class="flex items-center justify-center space-x-2">
                      <!-- Print Button -->
                      <button
                        @click="printItem(item)"
                        class="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                        title="Print"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>

                      <!-- Edit Button -->
                      <button
                        @click="editItem(item)"
                        class="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <!-- Delete Button -->
                      <button
                        @click="deleteItem(item)"
                        class="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        title="Delete"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State for Desktop -->
            <div v-if="computedPaginatedData.length === 0" class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-gray-500 text-2xl font-bold mb-2">Tidak ada data</p>
              <p class="text-gray-400 text-lg">Data yang Anda cari tidak ditemukan</p>
              <p class="text-gray-400 text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          </div>
        </div>        <!-- Enhanced Modern Footer with Pagination -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <!-- Info dan Pagination Controls -->
            <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              

              <!-- Pagination -->
              <div class="flex items-center space-x-2">
                <!-- Previous Button -->
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span class="hidden sm:inline">Prev</span>
                </button>

                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    @click="goToPage(page)"
                    class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
                    :class="currentPage === page 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'"
                  >
                    {{ page }}
                  </button>
                </div>

                <!-- Next Button -->
                <button
                  @click="nextPage"
                  :disabled="currentPage === computedTotalPages"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="currentPage === computedTotalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'"
                >
                  <span class="hidden sm:inline">Next</span>
                  <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Page Jump Input (Desktop only) -->
                <div class="hidden lg:flex items-center ml-4 space-x-2">
                  <span class="text-sm text-gray-600">Halaman:</span>
                  <input
                    type="number"
                    :value="currentPage"
                    @input="$emit('update:pageInput', parseInt($event.target.value))"
                    @keyup.enter="$emit('page-input-submit')"
                    @blur="$emit('page-input-submit')"
                    min="1"
                    :max="computedTotalPages"
                    class="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />                  <span class="text-sm text-gray-600">dari {{ computedTotalPages }}</span>
                </div>
              </div>
            </div>

            <!-- Back Button for Desktop (Bottom Right) -->
            <div class="hidden lg:block">
              <router-link
                to="/admin/dashboard"
                @click.native="goBack"
                class="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Enhanced Scrollbar */
  .scrollbar-fancy::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .scrollbar-fancy::-webkit-scrollbar-track {
    background: rgba(243, 244, 246, 0.5);
    border-radius: 3px;
  }

  .scrollbar-fancy::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #6366f1);
    border-radius: 3px;
  }

  .scrollbar-fancy::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #2563eb, #4f46e5);
  }

  /* Responsive optimizations */
  @media (max-width: 640px) {
    .tooltip .tooltiptext {
      max-width: 200px;
      font-size: 12px;
      padding: 8px 12px;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }

  /* Glassmorphism Effect */
  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
  }

  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }

  /* Custom focus styles */
  .focus\:ring-white\/50:focus {
    --tw-ring-color: rgba(255, 255, 255, 0.5);
  }

  /* Card hover effects */
  .hover\:-translate-y-1:hover {
    transform: translateY(-4px);
  }

  /* Button hover scale */
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
</style>
