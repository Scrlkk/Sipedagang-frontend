<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useRouter } from 'vue-router'
import EditFormComponent from '@/views/component/EditFormComponent.vue'
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const router = useRouter()

// Data Pemohon
const namaSupplier = ref('')
const namaPerusahaan = ref('')
const jenisBank = ref('Mandiri')
const nomerRekening = ref('')

// Detail Purchasing Order
const nomerPO = ref('')
const tanggalPengadaan = ref('')
const jenisPengadaan = ref('Beras')
const kuantum = ref('')
const satuan = ref('KG')

// Data In
const dataIN = ref([
  { tanggal: '', kuantum: '', satuan: 'KG' }
])

// Data Pembayaran
const jumlahPembayaran = ref('')
const jumlahSPP = ref('')
const formattedPembayaran = ref('')
const formattedSPP = ref('')  // Store the original data identifier for finding the item to update later
const originalIdentifier = ref({
  jenisPengadaan: '',
  noProorder: '',
  tanggal: '',
  formattedTanggal: '' // Store the formatted date for proper comparison
})

// Key for localStorage
const dataKey = 'permohonanDataList'
const formDataKey = 'permohonanFormData'

// Load data from localStorage on mount
onMounted(() => {
  loadData()
})

const loadData = () => {
  const storedData = localStorage.getItem(formDataKey)
  
  if (storedData) {
    const formData = JSON.parse(storedData)
    
    // Data Pemohon
    namaSupplier.value = formData.namaSupplier || ''
    namaPerusahaan.value = formData.namaPerusahaan || ''
    jenisBank.value = formData.jenisBank || 'Mandiri'
    nomerRekening.value = formData.nomerRekening || ''
    
    // Detail PO
    nomerPO.value = formData.nomerPO || ''
    tanggalPengadaan.value = formData.tanggalPengadaan || ''
    jenisPengadaan.value = formData.jenisPengadaan || 'Beras'
    kuantum.value = formData.kuantum || ''
    satuan.value = formData.satuan || 'KG'
    
    // Data IN
    dataIN.value = Array.isArray(formData.dataIN) && formData.dataIN.length > 0
      ? formData.dataIN
      : [{ tanggal: '', kuantum: '', satuan: 'KG' }]
    
    // Data Pembayaran
    jumlahPembayaran.value = formData.jumlahPembayaran || ''
    jumlahSPP.value = formData.jumlahSPP || ''
    
    // Format currency display values
    formattedPembayaran.value = formatRupiah(jumlahPembayaran.value)
    formattedSPP.value = formatRupiah(jumlahSPP.value)
      // Store original identifier for updating the right item
    originalIdentifier.value = {
      jenisPengadaan: formData.jenisPengadaan || '',
      noProorder: formData.nomerPO || '',
      tanggal: formData.tanggalPengadaan || '',
      formattedTanggal: ''
    }
    
    // Calculate the formatted date for matching with displayed data
    if (formData.tanggalPengadaan) {
      const date = new Date(formData.tanggalPengadaan)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      originalIdentifier.value.formattedTanggal = `${day}/${month}/${year}`
    }
  }
}

// Function for formatting currency
const formatRupiah = (value) => {
  if (!value) return '';
  return 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Helper: extract numeric value from formatted string
const extractNumericValue = (rupiahString) => {
  if (!rupiahString) return '';
  return rupiahString.replace(/[^\d]/g, '');
}

// Handler for input pembayaran
const handleJumlahPembayaranInput = (value) => {
  jumlahPembayaran.value = extractNumericValue(value);
  formattedPembayaran.value = formatRupiah(jumlahPembayaran.value);
}

const handleJumlahSPPInput = (value) => {
  jumlahSPP.value = extractNumericValue(value);
  formattedSPP.value = formatRupiah(jumlahSPP.value);
}

// Watch for changes in the main satuan and update all dataIN rows
const updateAllDataINSatuan = (newSatuan) => {
  satuan.value = newSatuan
  if (dataIN.value && dataIN.value.length > 0) {
    const updatedDataIN = dataIN.value.map(item => ({
      ...item,
      satuan: newSatuan
    }))
    dataIN.value = updatedDataIN
  }
}

// Handler for updating dataIN rows
const updateDataINRow = (updatedDataIN) => {
  dataIN.value = updatedDataIN
}

// Maximum number of dataIN rows
const maxDataInRows = 10

// Add row to dataIN
const addDataINRow = () => {
  if (dataIN.value.length < maxDataInRows) {
    // Get the satuan value from the last row, or use the default satuan if no rows exist
    const lastSatuan = dataIN.value.length > 0 ? dataIN.value[dataIN.value.length - 1].satuan : satuan.value
    dataIN.value.push({ tanggal: '', kuantum: '', satuan: lastSatuan })
  }
}

// Remove row from dataIN
const removeDataINRow = (index) => {
  if (dataIN.value.length > 1) {
    dataIN.value.splice(index, 1)
  }
}

// Update currency formatted values
const updateFormattedValues = () => {
  formattedPembayaran.value = formatRupiah(jumlahPembayaran.value)
  formattedSPP.value = formatRupiah(jumlahSPP.value)
}

// Validation function to check if all required fields are filled
const validateForm = () => {
  // Check if all required fields are filled, including Data IN tanggal field
  const emptyDateFound = dataIN.value.some(item => !item.tanggal);
  
  if (!namaSupplier.value || !namaPerusahaan.value || !nomerRekening.value || 
      !nomerPO.value || !tanggalPengadaan.value || !kuantum.value || emptyDateFound) {
    
    Swal.fire({
      title: 'Data Tidak Lengkap',
      text: 'Mohon lengkapi semua field yang diperlukan, termasuk tanggal pada Data IN',
      icon: 'warning',
      confirmButtonColor: '#0099FF',
      confirmButtonText: 'OK'
    });
    return false;
  }
  
  return true;
}

// Handler untuk event save dari EditFormComponent
const handleSave = () => {
  // Validate form first
  if (!validateForm()) {
    return;
  }
  
  // Build the complete form data
  const formData = {
    namaSupplier: namaSupplier.value,
    namaPerusahaan: namaPerusahaan.value,
    jenisBank: jenisBank.value,
    nomerRekening: nomerRekening.value,
    nomerPO: nomerPO.value,
    tanggalPengadaan: tanggalPengadaan.value,
    jenisPengadaan: jenisPengadaan.value,
    kuantum: kuantum.value,
    satuan: satuan.value,
    dataIN: dataIN.value,
    jumlahPembayaran: jumlahPembayaran.value,
    jumlahSPP: jumlahSPP.value
  }
  
  // Format tanggal for display
  let tanggalFormatted = ''
  if (tanggalPengadaan.value) {
    const date = new Date(tanggalPengadaan.value)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    tanggalFormatted = `${day}/${month}/${year}`
  }
  
  // Create entry for table display
  const displayEntry = {
    jenisPengadaan: jenisPengadaan.value,
    noProorder: nomerPO.value,
    supplier: namaSupplier.value,
    perusahaan: namaPerusahaan.value,
    kuantum: `${kuantum.value} ${satuan.value}`,
    tanggal: tanggalFormatted,
    rawData: formData
  }
  // Update or add the data in storage
  let savedDataList = []
  const savedDataString = localStorage.getItem(dataKey)
  
  if (savedDataString) {
    savedDataList = JSON.parse(savedDataString)
  }
  
  console.log('Original identifier:', originalIdentifier.value)
  console.log('Formatted date to match:', originalIdentifier.value.formattedTanggal)
    // Check if we need to update existing or add new
  const existingIndex = savedDataList.findIndex(item => 
    item.jenisPengadaan === originalIdentifier.value.jenisPengadaan &&
    item.noProorder === originalIdentifier.value.noProorder &&
    item.tanggal === originalIdentifier.value.formattedTanggal
  )
    if (existingIndex !== -1) {
    // Update existing entry
    console.log('Found existing entry at index:', existingIndex)
    savedDataList[existingIndex] = displayEntry
  } else {
    // Add new entry
    console.log('No matching entry found, adding new entry')
    savedDataList.push(displayEntry)
  }
    // Save updated list back to localStorage
  localStorage.setItem(dataKey, JSON.stringify(savedDataList))
    // Show success message
  Swal.fire({
    title: 'Tersimpan!',
    text: 'Data berhasil diperbarui.',
    icon: 'success',
    confirmButtonColor: '#0099FF'
  }).then(() => {
    // Navigate back to the data list using the router object
    // Note: We can't use router-link here since this is a JS function
    // but other component-based navigation should use router-link
    router.push('/admin/lihatdata');
  })
}

// Handler untuk event cancel dari EditFormComponent
const handleCancel = () => {
  // Navigate back to the dashboard
  // Note: We keep this programmatic navigation since it's inside an event handler
  // But other component-based navigation should use router-link
  router.push('/admin/dashboard');
}

// Handler to clear form data
const handleClear = () => {
  // Confirm via SweetAlert
  Swal.fire({
    title: 'Reset Form?',
    text: 'Semua data yang sudah diisi akan hilang.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Reset',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Reset all form fields
      namaSupplier.value = ''
      namaPerusahaan.value = ''
      jenisBank.value = 'Mandiri'
      nomerRekening.value = ''
      nomerPO.value = ''
      tanggalPengadaan.value = ''
      jenisPengadaan.value = 'Beras'
      kuantum.value = ''
      satuan.value = 'KG'
      dataIN.value = [{ tanggal: '', kuantum: '', satuan: 'KG' }]
      jumlahPembayaran.value = ''
      jumlahSPP.value = ''
      formattedPembayaran.value = ''
      formattedSPP.value = ''
    }
  })
}

// Preview functionality has been removed
</script>

<template>
  <AdminLayout class="h-screen overflow-hidden">
    <!-- Add transition wrapper -->
    <transition name="page" appear>
      <div class="flex flex-col min-h-[calc(100vh-120px)]">
        <!-- Mobile Navigation Bar (visible on small screens) -->
        <div class="lg:hidden flex justify-between items-center p-4 bg-white shadow-md z-30 border-b">
          <router-link 
            to="/admin/dashboard" 
            class="bg-blue-500 text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-blue-600 transition-colors text-sm"
            aria-label="Kembali ke Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Dashboard</span>
          </router-link>
          <router-link 
            to="/admin/lihatdata" 
            class="bg-blue-500 text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-blue-600 transition-colors text-sm"
            aria-label="Lihat Data Permohonan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Lihat Data</span>
          </router-link>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex justify-center py-4 px-4 lg:px-8 relative">
          <!-- Side Navigation (hidden on small screens) -->
          <div class="hidden lg:flex fixed left-4 xl:left-8 top-1/2 transform -translate-y-1/2 flex-col space-y-4 z-20">
            <router-link 
              to="/admin/dashboard" 
              class="bg-blue-500 text-white rounded-full w-14 xl:w-16 h-14 xl:h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors group"
              aria-label="Kembali ke Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 xl:h-7 w-6 xl:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <!-- Tooltip -->
              <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Dashboard
              </div>
            </router-link>
            <router-link 
              to="/admin/lihatdata" 
              class="bg-blue-500 text-white rounded-full w-14 xl:w-16 h-14 xl:h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors group"
              aria-label="Lihat Data Permohonan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 xl:h-7 w-6 xl:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <!-- Tooltip -->
              <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Lihat Data
              </div>
            </router-link>
          </div>

          <!-- Form Container with responsive margins -->
          <div class="w-full max-w-5xl lg:ml-20 xl:ml-24">
            <!-- Menggunakan EditFormComponent yang sudah dibuat sebagai presentational component -->
            <EditFormComponent 
              :namaSupplier="namaSupplier"
              :namaPerusahaan="namaPerusahaan"
              :jenisBank="jenisBank"
              :nomerRekening="nomerRekening"
              :nomerPO="nomerPO"
              :tanggalPengadaan="tanggalPengadaan"
              :jenisPengadaan="jenisPengadaan"
              :kuantum="kuantum"
              :satuan="satuan"
              :dataIN="dataIN"
              :jumlahPembayaran="jumlahPembayaran"
              :jumlahSPP="jumlahSPP"
              :formattedPembayaran="formattedPembayaran"
              :formattedSPP="formattedSPP"
              @update:namaSupplier="namaSupplier = $event"
              @update:namaPerusahaan="namaPerusahaan = $event"
              @update:jenisBank="jenisBank = $event"
              @update:nomerRekening="nomerRekening = $event"
              @update:nomerPO="nomerPO = $event"
              @update:tanggalPengadaan="tanggalPengadaan = $event"
              @update:jenisPengadaan="jenisPengadaan = $event"
              @update:kuantum="kuantum = $event"
              @update:satuan="updateAllDataINSatuan($event)"
              @update:dataIN="updateDataINRow($event)"
              @update:jumlahPembayaran="handleJumlahPembayaranInput($event)"
              @update:jumlahSPP="handleJumlahSPPInput($event)"
              @add-data-row="addDataINRow"
              @remove-data-row="removeDataINRow($event)"
              @clear-form="handleClear"
              @save-form="handleSave"
              @cancel="handleCancel"
            />
          </div>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
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

/* Form card animations */
.form-card {
  animation: shadowGrow 0.5s ease forwards;
}

/* Title animations */
.form-title {
  animation: fadeSlideDown 0.6s ease forwards;
  opacity: 0;
  transform: translateY(-10px);
}

.form-divider {
  animation: growFromCenter 0.8s ease forwards;
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
}

/* Form section staggered animations */
.form-section {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  transform: translateY(15px);
}

.form-section:nth-child(1) {
  animation-delay: 0.3s;
}

.form-section:nth-child(2) {
  animation-delay: 0.5s;
}

.form-section:nth-child(3) {
  animation-delay: 0.7s;
}

.form-section:nth-child(4) {
  animation-delay: 0.9s;
}

/* Button animations */
.form-button {
  animation: fadeIn 0.4s ease forwards;
  animation-delay: 1.1s;
  opacity: 0;
}

/* Keyframes */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shadowGrow {
  from {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
  }
  to {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
}

@keyframes fadeSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes growFromCenter {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>