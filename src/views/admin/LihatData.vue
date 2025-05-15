<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { ref, onMounted, watch, computed } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const selectedMonth = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const pageInput = ref(1)



// Mock data for the table
const tableData = ref([
  { jenisPengadaan: 'Gabah', noProorder: '1234/12/C11/30/2023', supplier: 'Purasewa', perusahaan: 'Bulog', kuantum: '500 Kg', tanggal: '12/01/2023' },
  { jenisPengadaan: 'Beras', noProorder: '1234/12/C11/30/2023', supplier: 'Kaisar', perusahaan: 'Bulog', kuantum: '100 Kg', tanggal: '15/02/2023' },
  { jenisPengadaan: 'Gula', noProorder: '1234/12/C11/30/2023', supplier: 'Sheva', perusahaan: 'Bulog', kuantum: '200 Kg', tanggal: '20/03/2023' },
  { jenisPengadaan: 'Minyak Goreng', noProorder: '1234/12/C11/30/2023', supplier: 'Satria', perusahaan: 'Bulog', kuantum: '300 Kg', tanggal: '25/04/2023' },
  { jenisPengadaan: 'Garam', noProorder: '1234/12/C11/30/2023', supplier: 'Raffi', perusahaan: 'Bulog', kuantum: '400 Kg', tanggal: '30/05/2023' },
  { jenisPengadaan: 'Kedelai', noProorder: '1234/12/C11/30/2023', supplier: 'Nopal', perusahaan: 'Bulog', kuantum: '600 Kg', tanggal: '05/06/2023' }

])

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
  { value: '12', label: 'Desember' }
]

const filteredData = () => {
  let filtered = [...tableData.value]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.jenisPengadaan.toLowerCase().includes(query) ||
      item.noProorder.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query) ||
      item.perusahaan.toLowerCase().includes(query)
    )
  }
  
  // Filter by selected month
  if (selectedMonth.value) {
    filtered = filtered.filter(item => {
      const month = item.tanggal.split('/')[1]
      return month === selectedMonth.value
    })
  }
  
  return filtered
}

const paginatedData = () => {
  const filtered = filteredData()
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  
  return filtered.slice(startIndex, endIndex)
}

const getTotalPages = () => {
  return Math.ceil(filteredData().length / itemsPerPage.value)
}

// Calculate which page numbers to show (max 5)
const displayedPageNumbers = computed(() => {
  const totalPages = getTotalPages()
  
  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  // We need to display 5 page numbers centered around current page if possible
  let start, end
  
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
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const goBack = () => {
  router.push('/dashboard')
}

const previewItem = (item) => {
  console.log('Preview:', item)
  // Add preview functionality here
}

const printItem = (item) => {
  console.log('Print:', item)
  // Add print functionality here
}

const editItem = (item) => {
  console.log('Edit:', item)
  // Add edit functionality here
}

const deleteItem = (item) => {
  Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Anda yakin ingin menghapus data ${item.jenisPengadaan}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with deletion
      console.log('Delete:', item)
      // Add delete functionality here
      
      // Show success message
      Swal.fire(
        'Terhapus!',
        'Data berhasil dihapus.',
        'success'
      )
    }
  })
}

const goToPage = (page) => {
  if (page >= 1 && page <= getTotalPages()) {
    currentPage.value = page
  }
}

const handlePageInput = () => {
  const totalPages = getTotalPages()
  
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

// Watch for currentPage changes to update input field
watch(currentPage, (newValue) => {
  pageInput.value = newValue
})

// Initialize pageInput with currentPage on mounted
onMounted(() => {
  pageInput.value = currentPage.value
})

</script>

<template>
  <AdminLayout class="h-screen overflow-hidden bg-gray-50">
    <!-- Add page transition wrapper -->
    <transition name="page" appear>
      <div class="flex items-center justify-center h-[calc(100vh-120px)] py-6 font-inter">
        <div class="w-full max-w-7xl mx-auto px-4">
          <!-- Main Container with improved visual hierarchy -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-auto max-h-[80vh] border border-gray-100">
            <!-- Enhanced Header with white background and blue title -->
<div class="bg-white p-6 border-b border-gray-200">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
    <h2 class="text-2xl font-bold text-[#0099FF] mb-4 sm:mb-0 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="#0099FF">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Lihat Data
    </h2>
    
    <!-- Improved search controls with better spacing -->
    <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 w-full sm:w-auto">
      <!-- Search input with enhanced styling -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari data..."
          class="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        />
      </div>
      
      <!-- Month dropdown with enhanced styling -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <select
          v-model="selectedMonth"
          class="pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent w-full text-gray-500"
        >
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>
            
         <!-- Table content with fixed dimensions and wider columns -->
<div class="overflow-y-auto" style="height: 450px;">
  <table class="min-w-full table-fixed">
    <thead class="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Jenis Pengadaan
        </th>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          No Preorder
        </th>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Supplier
        </th>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Perusahaan
        </th>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Kuantum
        </th>
        <th class="w-1/6 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Tanggal
        </th>
        <th class="w-1/6 px-8 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Aksi
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <!-- Row template with fixed height and wider cells -->
      <tr v-for="(item, index) in paginatedData()" :key="index" 
          :class="index % 2 === 0 ? 'bg-blue-50/60' : 'bg-amber-50/60'"
          class="hover:bg-gray-100 transition-colors h-16">
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.jenisPengadaan }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.noProorder }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.supplier }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.perusahaan }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.kuantum }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ item.tanggal }}
        </td>
        <td class="px-8 py-4 whitespace-nowrap text-sm text-center">
          <div class="flex justify-center gap-5">
            <a 
              @click.prevent="previewItem(item)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer font-medium underline"
            >
              Preview
            </a>
            <a 
              @click.prevent="printItem(item)" 
              class="text-green-600 hover:text-green-800 cursor-pointer font-medium underline"
            >
              Cetak
            </a>
            <a 
              @click.prevent="editItem(item)" 
              class="text-amber-600 hover:text-amber-800 cursor-pointer font-medium underline"
            >
              Edit
            </a>
            <a 
              @click.prevent="deleteItem(item)" 
              class="text-red-600 hover:text-red-800 cursor-pointer font-medium underline"
            >
              Delete
            </a>
          </div>
        </td>
      </tr>


                <!-- Empty rows to maintain consistent height when data is sparse -->
                <template v-if="paginatedData().length < itemsPerPage.value">
                  <tr 
                    v-for="i in (itemsPerPage.value - paginatedData().length)" 
                    :key="`empty-${i}`"
                    :class="(paginatedData().length + i) % 2 === 0 ? 'bg-blue-50/60' : 'bg-amber-50/60'"
                    class="h-16"
                  >
                    <td colspan="7" class="px-6 py-4"></td>
                  </tr>
                </template>

                <!-- Empty state when no data -->
                <tr v-if="paginatedData().length === 0" class="h-[400px]">
                  <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-lg font-medium">Tidak ada data</p>
                      <p class="text-sm mt-1">Tidak ada data yang sesuai dengan filter yang dipilih</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
            
            <!-- Footer with improved pagination and back button -->
            <div class="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
              <!-- Enhanced pagination with limit of 10 page numbers -->
              <div class="flex items-center space-x-2 mb-4 sm:mb-0">
                <!-- Previous page button -->
                <button 
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="w-10 h-10 flex items-center justify-center rounded-md border transition-colors"
                  :class="currentPage === 1 
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <!-- Limited Page Numbers (only show max 10) -->
                <div 
                  v-for="page in displayedPageNumbers" 
                  :key="page"
                  @click="goToPage(page)"
                  class="w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-colors"
                  :class="[
                    currentPage === page 
                      ? 'border-2 border-blue-500 text-blue-600 font-semibold' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </div>
                
                <!-- Next page button -->
                <button 
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === getTotalPages()"
                  class="w-10 h-10 flex items-center justify-center rounded-md border transition-colors"
                  :class="currentPage === getTotalPages() 
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <!-- Page input with manual typing -->
                <div class="relative ml-3 flex items-center">
                  <span class="mr-2 text-gray-600">Halaman:</span>
                  <div class="flex items-center">
                    <input
                      type="number"
                      v-model.number="pageInput"
                      @keyup.enter="handlePageInput"
                      @blur="handlePageInput"
                      min="1"
                      :max="getTotalPages()"
                      class="w-16 pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 text-center"
                    />
                    <span class="mx-1 text-gray-500">/</span>
                    <span class="text-gray-700">{{ getTotalPages() }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced back button -->
              <button 
                @click="goBack"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

/* Subtle row highlight effect */
tr {
  transition: all 0.2s ease;
}

/* Button hover effects */
button {
  transition: all 0.2s ease;
}

/* Apply Inter font to everything */
:root {
  font-family: 'Inter', sans-serif;
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Pagination hover animations */
.pagination-item {
  transition: all 0.2s ease;
}

.pagination-item:hover {
  transform: translateY(-2px);
}

/* Table row animations */
tbody tr {
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease forwards;
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
</style>