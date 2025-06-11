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
  <!-- ✅ Container utama dengan overflow tersembunyi - padding lebih kecil -->
  <div class="flex items-center justify-center">
    <!-- ✅ Container tabel dengan lebar maksimal dan tinggi terbatas - WIDTH DITAMBAH -->
    <div class="w-full max-w-6xl h-[72dvh] mx-auto">
      <!-- ⭐ HIGHLIGHT: Diubah dari max-w-6xl ke max-w-7xl -->
      <div
        class="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 flex flex-col h-full"
      >
        <!-- ✅ Header tetap dengan flex-shrink-0 - padding dikurangi -->
        <div
          class="bg-[#0099FF]/10 p-2 sm:p-4 md:p-6 border-b border-gray-200 rounded-t-lg sm:rounded-t-xl flex-shrink-0"
        >
          <!-- Header content - spacing dikurangi -->
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4"
          >
            <!-- Title - ukuran font dikurangi -->
            <h2
              class="text-lg sm:text-xl md:text-2xl font-bold text-[#0099FF] mb-1 sm:mb-0 flex items-center"
            >
              <div
                class="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-[#0099FF] text-white mr-2 sm:mr-3 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
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
              {{ userType === 'admin' ? 'Lihat Data' : 'Rekap Data' }}
            </h2>

            <!-- Filter controls - grid dikurangi spacing -->
            <div class="w-full sm:w-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <!-- Search input - padding dikurangi -->
                <div class="relative w-full group">
                  <div
                    class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-600"
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
                    placeholder="Cari data..."
                    class="pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-300 hover:shadow-md text-sm"
                    @input="$emit('update:searchQuery', $event.target.value)"
                  />
                  <!-- Clear button -->
                  <button
                    v-if="searchQuery"
                    @click="$emit('update:searchQuery', '')"
                    class="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <div
                      class="bg-gray-100 hover:bg-red-100 rounded-full p-0.5 sm:p-1 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 sm:h-4 sm:w-4"
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
                    </div>
                  </button>
                </div>

                <!-- ✅ Month dropdown - menggunakan availableMonths -->
                <div class="relative w-full group">
                  <div
                    class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none group-focus-within:text-indigo-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-600"
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
                    class="pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl appearance-none w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-700 shadow-sm transition-all duration-300 hover:shadow-md text-sm"
                    @change="$emit('update:selectedMonth', $event.target.value)"
                  >
                    <option
                      v-for="month in availableMonths"
                      :key="month.value"
                      :value="month.value"
                    >
                      {{ month.label }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none"
                  >
                    <div
                      class="bg-indigo-100 rounded-full p-0.5 sm:p-1 text-indigo-600 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 sm:h-4 sm:w-4"
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
              </div>

              <!-- ✅ Filter badges - menggunakan computed data -->
              <div
                v-if="searchQuery || selectedMonth"
                class="flex flex-wrap items-center mt-2 sm:mt-3 gap-1 sm:gap-2"
              >
                <!-- Search badge -->
                <div
                  v-if="searchQuery"
                  class="bg-[#0099FF]/10 text-[#0099FF] text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center border border-[#0099FF]/30 shadow-sm animate-fadeIn"
                >
                  <span class="text-xs">Pencarian: {{ searchQuery }}</span>
                  <button
                    @click="$emit('update:searchQuery', '')"
                    class="ml-1 sm:ml-2 text-[#0099FF] hover:text-red-500 transition-colors duration-200"
                  >
                    <div
                      class="bg-white/80 rounded-full p-0.5 hover:bg-red-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-2.5 w-2.5 sm:h-3 sm:w-3"
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
                    </div>
                  </button>
                </div>

                <!-- ✅ Month badge - menggunakan availableMonths -->
                <div
                  v-if="selectedMonth"
                  class="bg-[#0099FF]/10 text-[#0099FF] text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center border border-[#0099FF]/30 shadow-sm animate-fadeIn"
                >
                  <span class="text-xs"
                    >Bulan:
                    {{
                      availableMonths.find((m) => m.value === selectedMonth)
                        ?.label
                    }}</span
                  >
                  <button
                    @click="$emit('update:selectedMonth', '')"
                    class="ml-1 sm:ml-2 text-purple-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <div
                      class="bg-white/80 rounded-full p-0.5 hover:bg-red-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-2.5 w-2.5 sm:h-3 sm:w-3"
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
                    </div>
                  </button>
                </div>

                <!-- ✅ Results count - menggunakan computed data -->
                <div
                  class="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-100/70 rounded-full border border-gray-200/50 shadow-sm"
                >
                  <span class="font-bold text-indigo-700">{{
                    computedFilteredData.length
                  }}</span>
                  hasil
                </div>

                <!-- Reset button -->
                <button
                  @click="resetFilters"
                  class="ml-auto text-xs font-medium text-white flex items-center bg-[#0099FF] hover:bg-[#0077CC] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ Container tabel dengan scroll internal - margin dikurangi -->
        <div class="flex-1 overflow-hidden">
          <div
            class="h-full overflow-auto scrollbar-fancy m-1 sm:m-2 px-1 sm:px-2"
          >
            <table class="min-w-full table-fixed">
              <!-- ✅ Thead sticky - padding dikurangi -->
              <thead
                class="bg-[#0099FF]/10 sticky top-0 z-20 shadow-sm border-b border-gray-100"
                style="backdrop-filter: blur(10px)"
              >
                <tr>
                  <th
                    class="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[20%] sm:w-[15%] whitespace-nowrap rounded-tl-lg"
                  >
                    <div class="hidden sm:inline">Jenis Pengadaan</div>
                    <div class="sm:hidden flex items-center">
                      <span
                        class="bg-[#0099FF]/20 text-[#0099FF] p-0.5 rounded text-[9px] font-bold mr-1"
                        >JP</span
                      >
                      <span class="text-[10px]">/ Detail</span>
                    </div>
                  </th>
                  <th
                    class="hidden sm:table-cell px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[18%] whitespace-nowrap"
                  >
                    <span class="hidden md:inline">No Preorder</span>
                    <span class="md:hidden">No PO</span>
                  </th>
                  <th
                    class="hidden sm:table-cell px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[15%] whitespace-nowrap"
                  >
                    Supplier
                  </th>
                  <th
                    class="hidden md:table-cell px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[15%] whitespace-nowrap"
                  >
                    Perusahaan
                  </th>
                  <th
                    class="hidden sm:table-cell px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[12%] whitespace-nowrap"
                  >
                    Kuantum
                  </th>
                  <th
                    class="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-left text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[15%] sm:w-[10%] whitespace-nowrap"
                  >
                    <span class="hidden sm:inline">Tanggal</span>
                    <span class="sm:hidden">Tgl</span>
                  </th>
                  <th
                    class="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-center text-xs font-semibold text-[#0099FF] uppercase tracking-wider w-[20%] sm:w-[15%] whitespace-nowrap rounded-tr-lg"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>

              <!-- ✅ Tbody - menggunakan computedPaginatedData -->
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Data rows -->
                <tr
                  v-for="(item, index) in computedPaginatedData"
                  :key="index"
                  :class="index % 2 === 0 ? 'bg-[#0099FF]/5' : 'bg-white'"
                  class="transition-all duration-200"
                >
                  <!-- Jenis Pengadaan -->
                  <td
                    class="px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[20%] sm:w-[15%]"
                  >
                    <div class="tooltip py-1 font-medium truncate">
                      <div class="block sm:hidden">
                        <div class="flex flex-col">
                          <span
                            class="font-semibold text-gray-900 truncate text-xs"
                          >
                            {{ getItemValue(item, 'jenis_pengadaan') }}
                          </span>
                          <span
                            class="text-[10px] text-gray-500 mt-0.5 truncate"
                          >
                            PO: {{ getItemValue(item, 'no_preorder') }}
                          </span>
                        </div>
                      </div>
                      <div class="hidden sm:block truncate">
                        {{ getItemValue(item, 'jenis_pengadaan') }}
                      </div>
                      <span class="tooltiptext">
                        {{ getItemValue(item, 'jenis_pengadaan') }}
                      </span>
                    </div>
                  </td>

                  <!-- No Preorder -->
                  <td
                    class="hidden sm:table-cell px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[18%]"
                  >
                    <div
                      class="tooltip py-1 font-medium text-indigo-800 truncate"
                    >
                      {{ getItemValue(item, 'no_preorder') }}
                      <span class="tooltiptext">{{
                        getItemValue(item, 'no_preorder')
                      }}</span>
                    </div>
                  </td>

                  <!-- Supplier -->
                  <td
                    class="hidden sm:table-cell px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[15%]"
                  >
                    <div class="tooltip py-1 truncate">
                      {{ getItemValue(item, 'supplier') }}
                      <span class="tooltiptext">{{
                        getItemValue(item, 'supplier')
                      }}</span>
                    </div>
                  </td>

                  <!-- Perusahaan -->
                  <td
                    class="hidden md:table-cell px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[15%]"
                  >
                    <div class="tooltip py-1 truncate">
                      {{ getItemValue(item, 'perusahaan') }}
                      <span class="tooltiptext">{{
                        getItemValue(item, 'perusahaan')
                      }}</span>
                    </div>
                  </td>

                  <!-- Kuantum -->
                  <td
                    class="hidden sm:table-cell px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[12%]"
                  >
                    <div
                      class="tooltip py-1 font-medium text-gray-800 truncate"
                    >
                      {{ getItemValue(item, 'kuantum') }}
                      <span class="tooltiptext">{{
                        getItemValue(item, 'kuantum')
                      }}</span>
                    </div>
                  </td>

                  <!-- Tanggal -->
                  <td
                    class="px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200/30 w-[15%] sm:w-[10%]"
                  >
                    <span
                      class="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-gray-700 hidden sm:inline-block truncate text-xs"
                    >
                      {{ getItemValue(item, 'tanggal') }}
                    </span>
                    <span
                      class="sm:hidden bg-[#0099FF]/20 px-1.5 py-0.5 rounded text-[#0077CC] font-medium inline-block shadow-sm truncate text-[10px]"
                    >
                      {{ getItemValue(item, 'tanggal') }}
                    </span>
                  </td>

                  <!-- Action buttons - spacing dikurangi -->
                  <td
                    class="px-1 py-3 sm:px-2 sm:py-4 text-sm text-center whitespace-nowrap border-b border-gray-200/30 w-[20%] sm:w-[15%]"
                  >
                    <div class="flex items-center justify-center">
                      <div
                        class="inline-flex bg-white/80 backdrop-blur-sm rounded-md sm:rounded-lg shadow-sm border border-gray-100/80 p-0.5"
                      >
                        <button
                          @click="printItem(item)"
                          class="relative group px-1 py-1 sm:px-2 hover:bg-green-50 transition-all duration-200 flex items-center border-r border-gray-100"
                          title="Cetak"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 text-green-600"
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
                          class="relative group px-1 py-1 sm:px-2 hover:bg-amber-50 transition-all duration-200 flex items-center border-r border-gray-100"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          @click="deleteItem(item)"
                          class="relative group px-1 py-1 sm:px-2 rounded-r-md hover:bg-red-50 transition-all duration-200 flex items-center"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 sm:h-4 sm:w-4 text-red-600"
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
                  </td>
                </tr>

                <!-- ✅ Empty state - menggunakan computed data -->
                <tr v-if="computedPaginatedData.length === 0">
                  <td colspan="7" class="px-4 py-8 text-center">
                    <div
                      class="flex items-center justify-center max-w-sm mx-auto bg-white/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100/80"
                    >
                      <div
                        class="mr-2 sm:mr-3 p-1.5 sm:p-2 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full border-2 border-white shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <h3
                          class="text-sm sm:text-base text-left font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-0.5"
                        >
                          Tidak ada data
                        </h3>
                        <p
                          class="text-xs sm:text-sm text-left text-gray-500 mb-0"
                        >
                          {{
                            searchQuery || selectedMonth
                              ? 'Tidak ada data yang sesuai dengan filter yang dipilih'
                              : 'Belum ada data yang tersedia'
                          }}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ✅ Footer pagination - menggunakan computed data -->
        <div
          class="p-2 sm:p-4 md:p-5 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/80 flex flex-col sm:flex-row justify-between items-center rounded-b-lg sm:rounded-b-xl flex-shrink-0"
        >
          <!-- Pagination content -->
          <div class="flex items-center mb-2 sm:mb-0 order-2 sm:order-1">
            <div
              class="hidden sm:block text-xs sm:text-sm text-gray-600 mr-2 sm:mr-4"
            >
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(
                  currentPage * itemsPerPage,
                  computedFilteredData.length,
                )
              }}
              dari {{ computedFilteredData.length }} data
            </div>

            <div class="block sm:hidden text-xs text-gray-600 mr-2">
              {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(
                  currentPage * itemsPerPage,
                  computedFilteredData.length,
                )
              }}
              / {{ computedFilteredData.length }}
            </div>

            <!-- Custom pagination component -->
            <div class="flex items-center gap-1 sm:gap-2">
              <!-- Previous button -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-lg transition-all duration-200"
                :class="
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <!-- Page numbers -->
              <button
                v-for="page in visiblePageNumbers"
                :key="page"
                @click="goToPage(page)"
                class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-lg cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium"
                :class="
                  currentPage === page
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow'
                    : 'bg-white/80 text-gray-700 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow'
                "
              >
                {{ page }}
              </button>

              <!-- Next button -->
              <button
                @click="nextPage"
                :disabled="currentPage === computedTotalPages"
                class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-lg transition-all duration-200"
                :class="
                  currentPage === computedTotalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Page input - ukuran dikurangi -->
              <div class="ml-2 sm:ml-3 hidden sm:flex items-center">
                <span class="mr-1 sm:mr-2 text-gray-700 text-xs sm:text-sm"
                  >Halaman:</span
                >
                <input
                  type="number"
                  :value="currentPage"
                  @input="
                    $emit('update:pageInput', parseInt($event.target.value))
                  "
                  @keyup.enter="$emit('page-input-submit')"
                  @blur="$emit('page-input-submit')"
                  min="1"
                  :max="computedTotalPages"
                  class="w-12 sm:w-16 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-indigo-700 font-medium text-xs sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span class="ml-1.5 text-gray-500 text-xs sm:text-sm"
                  >/ {{ computedTotalPages }}</span
                >
              </div>
            </div>
          </div>

          <!-- Back button - ukuran dikurangi -->
          <div class="order-1 sm:order-2">
            <router-link
              to="/admin/dashboard"
              @click.native="goBack"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium flex items-center shadow-sm hover:shadow focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transform transition-transform hover:-translate-y-0.5 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-1.5"
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
</template>

<style scoped>
  /* ✅ Scrollbar diperkecil lagi */
  .scrollbar-fancy::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .scrollbar-fancy::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.3);
    border-radius: 2px;
  }

  .scrollbar-fancy::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #0099ff, #3b82f6);
    border-radius: 2px;
  }

  .scrollbar-fancy::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0077cc, #2563eb);
  }

  /* ✅ Responsive table */
  @media (max-width: 640px) {
    .tooltip .tooltiptext {
      max-width: 150px;
      font-size: 11px;
      padding: 6px 8px;
    }
  }

  /* ✅ Container utama dengan overflow tersembunyi */
  .min-h-screen {
    min-height: 100vh;
  }

  /* ✅ Thead sticky dengan backdrop */
  thead {
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(0, 153, 255, 0.1);
  }

  /* ✅ Tooltip styling */
  .tooltip {
    position: relative;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px 12px;
    position: absolute;
    z-index: 30;
    bottom: 125%;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: normal;
    max-width: 200px;
    width: max-content;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

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
</style>
