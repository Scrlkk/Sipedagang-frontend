<script setup>
  import AdminLayout from '@/layouts/AdminLayout.vue'
  import LihatDataComponent from '@/components/LihatDataComponent.vue'
  import { useRouter } from 'vue-router'
  import { ref, onMounted, watch, computed } from 'vue'
  import Swal from 'sweetalert2'

  const router = useRouter()

  const searchQuery = ref('')
  const selectedMonth = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(6)
  const pageInput = ref(1)
  const isExtraSmallScreen = ref(false)

  // Data table for storing form submissions
  const tableData = ref([])

  // Load stored data from localStorage on component mount
  onMounted(() => {
    loadStoredData()
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  // Clean up event listener
  const onBeforeUnmount = () => {
    window.removeEventListener('resize', checkScreenSize)
  }

  // Function to check if screen is extra small
  const checkScreenSize = () => {
    isExtraSmallScreen.value = window.innerWidth < 480
  }

  // Function to load data from localStorage
  const loadStoredData = () => {
    const savedData = localStorage.getItem('permohonanDataList')
    if (savedData) {
      tableData.value = JSON.parse(savedData)
    } else {
      // If no data exists yet, check if there's a single form submission
      const singleFormData = localStorage.getItem('permohonanFormData')
      if (singleFormData) {
        const formData = JSON.parse(singleFormData)

        // Format tanggal from ISO string to dd/mm/yyyy
        let tanggalFormatted = ''
        if (formData.tanggalPengadaan) {
          const date = new Date(formData.tanggalPengadaan)
          const day = date.getDate().toString().padStart(2, '0')
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const year = date.getFullYear()
          tanggalFormatted = `${day}/${month}/${year}`
        }

        // Create a data entry for the table
        const entry = {
          jenisPengadaan: formData.jenisPengadaan || '',
          noProorder: formData.nomerPO || '',
          supplier: formData.namaSupplier || '',
          perusahaan: formData.namaPerusahaan || '',
          kuantum: `${formData.kuantum || ''} ${formData.satuan || 'KG'}`,
          tanggal: tanggalFormatted,
          rawData: formData, // Store the full raw data for preview
        }

        tableData.value = [entry]

        // Save to localStorage as a list
        localStorage.setItem(
          'permohonanDataList',
          JSON.stringify(tableData.value),
        )
      }
    }
  }

  const months = [
    { value: '', label: 'Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]

  const filteredData = computed(() => {
    let filtered = [...tableData.value]

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          (item.jenisPengadaan &&
            item.jenisPengadaan.toLowerCase().includes(query)) ||
          (item.noProorder && item.noProorder.toLowerCase().includes(query)) ||
          (item.supplier && item.supplier.toLowerCase().includes(query)) ||
          (item.perusahaan && item.perusahaan.toLowerCase().includes(query)),
      )
    }

    // Filter by selected month
    if (selectedMonth.value) {
      filtered = filtered.filter((item) => {
        if (item.tanggal && item.tanggal.includes('/')) {
          const month = item.tanggal.split('/')[1]
          return month === selectedMonth.value
        }
        return false
      })
    }

    return filtered
  })

  const paginatedData = computed(() => {
    const filtered = filteredData.value
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value

    return filtered.slice(startIndex, endIndex)
  })

  const getTotalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value)
  })

  // Calculate which page numbers to show (max 5, fewer on small screens)
  const displayedPageNumbers = computed(() => {
    const totalPages = getTotalPages.value

    // For extra small screens, show fewer pages
    const maxPages = isExtraSmallScreen.value ? 3 : 5

    if (totalPages <= maxPages) {
      // If fewer pages than maximum, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // We need to display pagination numbers centered around current page if possible
    let start, end

    if (isExtraSmallScreen.value) {
      // For extra small screens, simplify pagination further
      if (currentPage.value === 1) {
        // At start, show first 3
        start = 1
        end = 3
      } else if (currentPage.value >= totalPages) {
        // At end, show last 3
        start = totalPages - 2
        end = totalPages
      } else {
        // Show current page and neighbors
        start = currentPage.value - 1
        end = currentPage.value + 1
      }
    } else {
      // For larger screens
      if (currentPage.value <= 3) {
        // If at the beginning, show first 5 pages
        start = 1
        end = 5
      } else if (currentPage.value >= totalPages - 2) {
        // If near the end, show last 5 pages
        start = totalPages - 4
        end = totalPages
      } else {
        // Show 2 pages before and 2 after current page (total of 5)
        start = currentPage.value - 2
        end = currentPage.value + 2
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })
  const openPrintPreview = () => {
    window.open(`/surat-preview/${props.item.id}`, '_blank')
  }
  // Event handlers for storing data before navigation
  const handlePreview = (item) => {
    console.log('Preview:', item)

    // Store the selected data in localStorage for preview
    if (item && item.rawData) {
      localStorage.setItem('permohonanFormData', JSON.stringify(item.rawData))
    } else {
      // If there's no rawData property, try to use the item itself
      localStorage.setItem('permohonanFormData', JSON.stringify(item))
    }
  }

  const handlePrint = (item) => {
    console.log('Print:', item)

    // Store the selected data in localStorage for print
    if (item && item.rawData) {
      localStorage.setItem('permohonanFormData', JSON.stringify(item.rawData))
      localStorage.setItem('autoPrint', 'true') // Set flag to auto-print
    } else {
      // If there's no rawData property, try to use the item itself
      localStorage.setItem('permohonanFormData', JSON.stringify(item))
      localStorage.setItem('autoPrint', 'true') // Set flag to auto-print
    }
  }

  const handleEdit = (item) => {
    console.log('Edit:', item)

    // Store the selected data in localStorage for editing
    if (item && item.rawData) {
      localStorage.setItem('permohonanFormData', JSON.stringify(item.rawData))
    } else {
      // If there's no rawData property, try to use the item itself
      localStorage.setItem('permohonanFormData', JSON.stringify(item))
    }
  }

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Anda yakin ingin menghapus data ${item.jenisPengadaan}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Find and remove the item from tableData
        const index = tableData.value.findIndex(
          (i) =>
            i.jenisPengadaan === item.jenisPengadaan &&
            i.noProorder === item.noProorder &&
            i.tanggal === item.tanggal,
        )

        if (index !== -1) {
          tableData.value.splice(index, 1)

          // Update localStorage with the updated list
          localStorage.setItem(
            'permohonanDataList',
            JSON.stringify(tableData.value),
          )

          // Show success message
          Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success')
        }
      }
    })
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= getTotalPages.value) {
      currentPage.value = page
    }
  }

  const handlePageInput = () => {
    const totalPages = getTotalPages.value

    // Make sure it's a number and in valid range
    let newPage = parseInt(pageInput.value)

    if (isNaN(newPage) || newPage < 1) {
      // Reset to current page if invalid
      pageInput.value = currentPage.value
      return
    }

    // Cap at max pages
    if (newPage > totalPages) {
      newPage = totalPages
    }

    // Update both values
    pageInput.value = newPage
    currentPage.value = newPage
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedMonth.value = ''
    currentPage.value = 1
  }

  // Watch for currentPage changes to update input field
  watch(currentPage, (newValue) => {
    pageInput.value = newValue
  })
</script>

<template>
  <AdminLayout class="h-screen overflow-hidden bg-gray-50">
    <!-- Add page transition wrapper -->
    <transition name="page" appear>
      <div
        class="flex items-center justify-center h-[calc(100vh-120px)] py-6 font-inter"
      >
        <!-- Using our reusable presentational component -->
        <LihatDataComponent
          :tableData="tableData"
          :searchQuery="searchQuery"
          :selectedMonth="selectedMonth"
          :currentPage="currentPage"
          :itemsPerPage="itemsPerPage"
          :pageInput="pageInput"
          :months="months"
          :filteredData="filteredData"
          :paginatedData="paginatedData"
          :getTotalPages="getTotalPages"
          :isExtraSmallScreen="isExtraSmallScreen"
          :displayedPageNumbers="displayedPageNumbers"
          userType="admin"
          @update:searchQuery="searchQuery = $event"
          @update:selectedMonth="selectedMonth = $event"
          @update:currentPage="currentPage = $event"
          @update:pageInput="pageInput = $event"
          @page-input-submit="handlePageInput"
          @back="handleBack"
          @preview="handlePreview"
          @print="handlePrint"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
  /* Page transition animations */
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
