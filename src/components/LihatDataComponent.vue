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

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A'
    let date
    // Coba parsing berbagai format
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
      } else {
        date = new Date(dateString)
      }
    } else {
      date = new Date(dateString)
    }
    if (!date || isNaN(date.getTime())) return dateString
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }
</script>

<template>
  <!-- Simple Container -->
  <div class="px-4 max-w-5xl max-h-[36rem] mx-auto">
    <!-- Simple Content Card -->
    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <!-- Simple Header -->
      <div class="bg-blue-600 p-2 sm:p-4 rounded-b-lg">
        <!-- Mobile Back Button -->

        <div class="flex sm:hidden mb-2">
          <router-link
            to="/admin/dashboard"
            @click.native="goBack"
            class="inline-flex items-center px-2 py-1 bg-white/20 text-white text-xs font-medium rounded border border-white/30 hover:bg-white/30"
          >
            <svg
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </router-link>

          <div class="items-center pl-4 space-x-1 flex">
            <div class="p-1 bg-white/20 rounded-lg">
              <svg
                class="h-4 w-4 text-white"
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
              <h1 class="text-sm sm:text-lg font-bold text-white leading-tight">
                {{ userType === 'admin' ? 'Lihat Data' : 'Rekap Data' }}
              </h1>
              <p class="text-white/80 text-[11px] sm:text-sm leading-tight">
                Data Pengadaan
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-between items-start gap-2"
        >
          <!-- Title -->
          <div class="items-center space-x-1 hidden sm:flex">
            <div class="p-1 bg-white/20 rounded-lg">
              <svg
                class="h-4 w-4 text-white"
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
              <h1 class="text-sm sm:text-lg font-bold text-white leading-tight">
                {{ userType === 'admin' ? 'Lihat Data' : 'Rekap Data' }}
              </h1>
              <p class="text-white/80 text-[11px] sm:text-sm leading-tight">
                Data Pengadaan
              </p>
            </div>
          </div>

          <!-- Search & Filter -->
          <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <!-- Active Filters -->
            <div
              v-if="searchQuery || selectedMonth"
              class="lg:flex lg:flex-wrap hidden gap-2 mt-3"
            >
              <span
                v-if="searchQuery"
                class="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs rounded-full"
              >
                Pencarian: {{ searchQuery }}
                <button
                  @click="$emit('update:searchQuery', '')"
                  class="ml-2 text-white/80 hover:text-white"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                v-if="selectedMonth"
                class="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs rounded-full"
              >
                Bulan:
                {{
                  availableMonths.find((m) => m.value === selectedMonth)?.label
                }}
                <button
                  @click="$emit('update:selectedMonth', '')"
                  class="ml-2 text-white/80 hover:text-white"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                class="px-3 py-1 bg-white/30 text-white text-xs rounded-full font-medium"
              >
                {{ computedFilteredData.length }} hasil
              </span>
            </div>
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                :value="searchQuery"
                placeholder="Cari data..."
                class="w-full sm:w-64 pl-9 pr-9 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                @input="$emit('update:searchQuery', $event.target.value)"
              />
              <svg
                class="absolute left-3 top-2.5 h-4 w-4 text-white/60"
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
              <button
                v-if="searchQuery"
                @click="$emit('update:searchQuery', '')"
                class="absolute right-3 top-2.5 text-white/60 hover:text-white"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Month Filter -->
            <div class="relative">
              <select
                :value="selectedMonth"
                @change="$emit('update:selectedMonth', $event.target.value)"
                class="w-full sm:w-40 pl-9 pr-8 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option
                  v-for="month in availableMonths"
                  :key="month.value"
                  :value="month.value"
                  class="text-gray-900"
                >
                  {{ month.label }}
                </option>
              </select>
              <svg
                class="absolute left-3 top-2.5 h-4 w-4 text-white/60"
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
              <svg
                class="absolute right-3 top-2.5 h-4 w-4 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        <!-- Active Filters -->
        <div
          v-if="searchQuery || selectedMonth"
          class="flex flex-wrap gap-1 mt-2 w-full sm:mt-3 md:gap-2 md:mt-3 md:flex md:flex-wrap lg:hidden"
        >
          <span
            v-if="searchQuery"
            class="inline-flex items-center px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full md:px-3 md:py-1 md:text-xs"
          >
            Pencarian: {{ searchQuery }}
            <button
              @click="$emit('update:searchQuery', '')"
              class="ml-1 text-white/80 hover:text-white md:ml-2"
            >
              <svg
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
          <span
            v-if="selectedMonth"
            class="inline-flex items-center px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full md:px-3 md:py-1 md:text-xs"
          >
            Bulan:
            {{ availableMonths.find((m) => m.value === selectedMonth)?.label }}
            <button
              @click="$emit('update:selectedMonth', '')"
              class="ml-1 text-white/80 hover:text-white md:ml-2"
            >
              <svg
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
          <span
            class="px-2 py-0.5 bg-white/30 text-white text-[10px] rounded-full font-medium md:px-3 md:py-1 md:text-xs"
          >
            {{ computedFilteredData.length }} hasil
          </span>
        </div>
      </div>
      <!-- Simple Table Container -->
      <div class="overflow-x-auto">
        <!-- Mobile Card View -->
        <div
          class="block md:hidden p-4 space-y-3 relative"
          style="max-height: 28rem; overflow-y: auto"
        >
          <div
            v-for="(item, index) in computedPaginatedData"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <!-- Card Header -->
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">
                  {{ getItemValue(item, 'jenis_pengadaan') }}
                </h3>
                <p class="text-xs text-gray-500">
                  {{ getItemValue(item, 'no_preorder') }}
                </p>
              </div>
              <div class="flex space-x-1">
                <button
                  @click="printItem(item)"
                  class="p-1.5 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                </button>
                <button
                  @click="editItem(item)"
                  class="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteItem(item)"
                  class="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Content -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-500">Supplier:</span>
                <div class="font-medium text-gray-900">
                  {{ getItemValue(item, 'supplier') }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Perusahaan:</span>
                <div class="font-medium text-gray-900">
                  {{ getItemValue(item, 'perusahaan') }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Kuantum:</span>
                <div class="font-medium text-blue-600">
                  {{ getItemValue(item, 'kuantum') }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Tanggal:</span>
                <div class="font-medium text-gray-900">
                  {{ getItemValue(item, 'tanggal') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State Mobile -->
          <div
            v-if="computedPaginatedData.length === 0"
            class="text-center py-8"
          >
            <svg
              class="h-12 w-12 text-gray-300 mx-auto mb-3"
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
            <p class="text-gray-500 font-medium">Tidak ada data</p>
            <p class="text-gray-400 text-sm">
              Data yang dicari tidak ditemukan
            </p>
          </div>

          <!-- Sticky Pagination Footer Mobile -->
          <div
            class="bg-white border-t border-gray-200 p-3 w-full sticky -bottom-4 left-0 z-20"
            style="box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03)"
          >
            <div
              class="flex flex-col xs:flex-row justify-between items-center gap-3"
            >
              <div class="text-xs text-gray-600">
                Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
                {{
                  Math.min(
                    currentPage * itemsPerPage,
                    computedFilteredData.length,
                  )
                }}
                dari {{ computedFilteredData.length }} data
              </div>
              <div class="flex items-center space-x-1">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-2 py-1 border rounded text-xs"
                  :class="
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                  "
                >
                  ‹
                </button>
                <button
                  v-for="page in visiblePageNumbers"
                  :key="page"
                  @click="goToPage(page)"
                  class="w-7 h-7 flex items-center justify-center rounded text-xs font-medium"
                  :class="
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  "
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === computedTotalPages"
                  class="px-2 py-1 border rounded text-xs"
                  :class="
                    currentPage === computedTotalPages
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                  "
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block relative">
          <!-- Scrollable Table Container -->
          <div class="overflow-x-auto" style="max-height: 420px">
            <table class="w-full min-w-max">
              <!-- Simple Table Header -->
              <thead
                class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10"
              >
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    No. Preorder
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Perusahaan
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Supplier
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Jenis Pengadaan
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Kuantum
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Tanggal
                  </th>
                  <th
                    class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <!-- Table Body -->
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in computedPaginatedData"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900">
                      {{ getItemValue(item, 'no_preorder') }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900">
                      {{ getItemValue(item, 'perusahaan') }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900">
                      {{ getItemValue(item, 'supplier') }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getItemValue(item, 'jenis_pengadaan') }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ getItemValue(item, 'kuantum') }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900">
                      {{ formatDate(getItemValue(item, 'tanggal')) }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex justify-center space-x-1">
                      <button
                        @click="printItem(item)"
                        class="p-1.5 text-purple-600 bg-purple-100 rounded hover:bg-purple-200"
                        title="Print"
                      >
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="editItem(item)"
                        class="p-1.5 text-green-600 bg-green-100 rounded hover:bg-green-200"
                        title="Edit"
                      >
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="deleteItem(item)"
                        class="p-1.5 text-red-600 bg-red-100 rounded hover:bg-red-200"
                        title="Delete"
                      >
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Empty State Desktop -->
            <div
              v-if="computedPaginatedData.length === 0"
              class="text-center py-12"
            >
              <svg
                class="h-16 w-16 text-gray-300 mx-auto mb-4"
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
              <p class="text-gray-500 text-lg font-medium">Tidak ada data</p>
              <p class="text-gray-400">Data yang dicari tidak ditemukan</p>
            </div>
          </div>
          <!-- Sticky Pagination Footer -->
          <div
            class="bg-gray-50 border-t border-gray-200 p-4 w-full sticky bottom-0 left-0 z-20"
            style="box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03)"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <!-- Pagination Info -->
              <div class="text-sm text-gray-600">
                Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
                {{
                  Math.min(
                    currentPage * itemsPerPage,
                    computedFilteredData.length,
                  )
                }}
                dari {{ computedFilteredData.length }} data
              </div>
              <!-- Pagination Controls -->
              <div class="flex items-center space-x-2">
                <!-- Previous Button -->
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border rounded text-sm"
                  :class="
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                  "
                >
                  ‹ Prev
                </button>

                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    @click="goToPage(page)"
                    class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium"
                    :class="
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    "
                  >
                    {{ page }}
                  </button>
                </div>

                <!-- Next Button -->
                <button
                  @click="nextPage"
                  :disabled="currentPage === computedTotalPages"
                  class="px-3 py-1 border rounded text-sm"
                  :class="
                    currentPage === computedTotalPages
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                  "
                >
                  Next ›
                </button>
              </div>
              <!-- Back Button (Desktop only) -->
              <div class="hidden sm:block">
                <router-link
                  to="/admin/dashboard"
                  @click.native="goBack"
                  class="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50"
                >
                  <svg
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Kembali
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Simple scrollbar */
  .overflow-x-auto::-webkit-scrollbar {
    height: 4px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 2px;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  /* Focus styles */
  .focus\:ring-white\/50:focus {
    --tw-ring-color: rgba(255, 255, 255, 0.5);
  }
</style>
