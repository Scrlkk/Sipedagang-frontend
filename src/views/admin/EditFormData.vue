<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()

// Store the original data identifier for finding the item to update later
const originalIdentifier = ref({
  jenisPengadaan: '',
  noProorder: '',
  tanggal: ''
})

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

// Data IN
const dataIN = ref([
  { tanggal: '', kuantum: '', satuan: 'KG' },
])

// Watch satuan changes and update all dataIN rows
watch(satuan, (newSatuan) => {
  dataIN.value.forEach(row => {
    row.satuan = newSatuan;
  });
})

// Informasi Pembayaran
const jumlahPembayaran = ref('')
const jumlahSPP = ref('')

// Function to format value as Rupiah in input fields
const formatRupiahInput = (value) => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  let number = value.toString().replace(/[^\d]/g, '');
  
  // Format the number with thousand separators
  return 'Rp ' + number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Function to extract numeric value from formatted Rupiah string
const extractNumericValue = (rupiahString) => {
  if (!rupiahString) return '';
  return rupiahString.replace(/[^\d]/g, '');
}

// Form actions
const clearForm = () => {
  namaSupplier.value = ''
  namaPerusahaan.value = ''
  jenisBank.value = 'Mandiri'
  nomerRekening.value = ''
  nomerPO.value = ''
  tanggalPengadaan.value = '2025-01-12'
  jenisPengadaan.value = 'Beras'
  kuantum.value = ''
    // Keep just one empty row when clearing
  dataIN.value = [{ tanggal: '', kuantum: '', satuan: 'KG' }]
  
  jumlahPembayaran.value = ''
  jumlahSPP.value = ''
}

const saveForm = () => {
  // Validate essential fields
  if (!namaSupplier.value || !namaPerusahaan.value || !nomerRekening.value || 
      !nomerPO.value || !tanggalPengadaan.value || !kuantum.value) {
    Swal.fire({
      title: 'Data Tidak Lengkap',
      text: 'Mohon lengkapi semua field yang diperlukan',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok'
    });
    return;
  }
  
  // Validate satuan consistency
  let isDataINValid = true;
  dataIN.value.forEach((item, index) => {
    if (item.kuantum && item.satuan !== satuan.value) {
      isDataINValid = false;
    }
  });
  
  if (!isDataINValid) {
    Swal.fire({
      title: 'Satuan Tidak Konsisten',
      text: 'Satuan pada Data IN harus sama dengan satuan pada Kuantum',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok'
    });
    return;
  }
  
  // Collect form data
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
    // Save form data to localStorage
  localStorage.setItem('permohonanFormData', JSON.stringify(formData))
  
  // Also update the data in permohonanDataList
  const savedDataList = localStorage.getItem('permohonanDataList');
  if (savedDataList) {
    try {
      const dataList = JSON.parse(savedDataList);
      
      // Format tanggal for the table view
      const date = new Date(tanggalPengadaan.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const tanggalFormatted = `${day}/${month}/${year}`;
      
      // Create updated entry
      const updatedEntry = {
        jenisPengadaan: jenisPengadaan.value,
        noProorder: nomerPO.value,
        supplier: namaSupplier.value,
        perusahaan: namaPerusahaan.value,
        kuantum: `${kuantum.value} ${satuan.value}`,
        tanggal: tanggalFormatted,
        rawData: formData // Store the full raw data for preview
      }      // Find the index of the entry with the original identifiers (before any edits)
      // Using the same criteria as the deleteItem function in LihatData.vue
      const index = dataList.findIndex(
        item => item.jenisPengadaan === originalIdentifier.value.jenisPengadaan && 
               item.noProorder === originalIdentifier.value.noProorder &&
               item.tanggal === originalIdentifier.value.tanggal
      );
        console.log('Looking for entry with:', originalIdentifier.value);
      console.log('Index found:', index);
      
      if (index !== -1) {
        // Replace the existing entry
        console.log('Updating existing entry at index:', index);
        dataList[index] = updatedEntry;
      } else {
        // If no match found, add as a new entry
        console.log('No matching entry found, adding new entry');
        dataList.push(updatedEntry);
      }
      
      // Save the updated list back to localStorage
      localStorage.setItem('permohonanDataList', JSON.stringify(dataList));
    } catch (e) {
      console.error('Error updating data list:', e);
    }
  }
  
  // Show success message
  Swal.fire({
    title: 'Berhasil!',
    text: 'Data berhasil diperbarui',
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Lihat Data'
  }).then((result) => {
    if (result.isConfirmed) {
      // Navigate back to the data list
      router.push('/lihatdata')
    }
  });
}

// Function to load stored data from localStorage when component mounts
onMounted(() => {
  const savedData = localStorage.getItem('permohonanFormData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
        // Store the original data identifier for finding the record to update later
      // Format date exactly like it's shown in the table
      let formattedDate = '';
      if (parsedData.tanggalPengadaan) {
        const date = new Date(parsedData.tanggalPengadaan);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      }

      originalIdentifier.value = {
        jenisPengadaan: parsedData.jenisPengadaan || '',
        noProorder: parsedData.nomerPO || '',
        tanggal: formattedDate
      };
      
      // Populate form fields with the parsed data
      namaSupplier.value = parsedData.namaSupplier || '';
      namaPerusahaan.value = parsedData.namaPerusahaan || '';
      jenisBank.value = parsedData.jenisBank || 'Mandiri';
      nomerRekening.value = parsedData.nomerRekening || '';
      nomerPO.value = parsedData.nomerPO || '';
      tanggalPengadaan.value = parsedData.tanggalPengadaan || '';
      jenisPengadaan.value = parsedData.jenisPengadaan || 'Beras';
      kuantum.value = parsedData.kuantum || '';
      satuan.value = parsedData.satuan || 'KG';
      
      // Handle dataIN separately to ensure it's formatted correctly
      if (parsedData.dataIN && Array.isArray(parsedData.dataIN) && parsedData.dataIN.length > 0) {
        // Ensure each dataIN entry has a satuan property that matches the current satuan
        dataIN.value = parsedData.dataIN.map(item => ({
          tanggal: item.tanggal || '',
          kuantum: item.kuantum || '',
          satuan: satuan.value // Apply the current satuan to all rows
        }));
      } else {
        // Default to a single empty row if no dataIN is present
        dataIN.value = [{ tanggal: '', kuantum: '', satuan: satuan.value }];
      }
      
      jumlahPembayaran.value = parsedData.jumlahPembayaran || '';
      jumlahSPP.value = parsedData.jumlahSPP || '';
      
      console.log('Form data loaded from localStorage:', parsedData);
    } catch (e) {
      console.error('Error parsing saved data:', e);
      
      // Handle error case - show notification to user
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat memuat data. Silahkan coba lagi.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  }
})

// Function to add a new row to dataIN
const addDataInRow = () => {
  if (dataIN.value.length >= 10) {
    // Show SweetAlert notification
    Swal.fire({
      title: 'Batas Maksimum',
      text: 'Maksimum Untuk Data IN hanya 10 baris',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Oke'
    });
    return; // Exit the function without adding a row
  }
    // If under the limit, add a new row with the current satuan value
  dataIN.value.push({ tanggal: '', kuantum: '', satuan: satuan.value });
}
</script>

<template>
  <AdminLayout class="h-screen overflow-hidden">
    <!-- Add transition wrapper -->
    <transition name="page" appear>
      <div class="flex items-center justify-center min-h-[calc(80vh-120px)] py-6">
        <!-- Side Navigation (unchanged) -->
        <div class="fixed left-8 lg:left-1/6 top-1/3 flex flex-col space-y-4 z-20">
          <router-link 
            to="/dashboard" 
            class="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <router-link 
            to="/lihatdata" 
            class="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </router-link>
        </div>

        <!-- Form Card Container -->
        <div class="w-full max-w-5xl mx-auto px-4">
          <div class="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[80vh] border border-gray-100 form-card">
            <!-- Form Header -->
            <div class="text-center pb-2 bg-white z-10">
              <h2 class="text-xl font-medium mt-10 mb-1 form-title" style="color: #0099FF;">Edit Form Input Data</h2>
              <div class="mx-auto form-divider" style="height: 3px; background-color: #0099FF; width: 100%; max-width: 200px; margin-bottom: 20px;"></div>
            </div>

            <!-- Scrollable Form Content -->
            <div class="overflow-y-auto flex-grow">
              <div class="p-6">
                <!-- Data Pemohon Section -->
                <div class="mb-8 form-section">
                  <h3 class="font-medium text-lg mb-4">Data Pemohon</h3>

                  <!-- Horizontal layout for form fields -->
                  <div class="space-y-3">
                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Nama Supplier</label>
                      <input
                        type="text"
                        v-model="namaSupplier"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Nama Supplier"
                      />
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Nama Perusahaan</label>
                      <input
                        type="text"
                        v-model="namaPerusahaan"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Nama Perusahaan"
                      />
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Jenis Bank</label>
                      <div class="relative w-3/4">
                        <select
                          v-model="jenisBank"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                        >
                          <option>Mandiri</option>
                          <option>BCA</option>
                          <option>BNI</option>
                          <option>BRI</option>
                          <option>CIMB Niaga</option>
                          <option>BTN</option>
                          <option>Permata</option>
                        </select>
                        <div class="absolute right-3 top-3 text-gray-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Nomer Rekening</label>
                      <input
                        type="text"
                        v-model="nomerRekening"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Nomer Rekening"
                      />
                    </div>
                  </div>
                </div>

                <!-- Detail Purchasing Order Section -->
                <div class="form-section">
                  <h3 class="font-medium text-lg mb-4">Detail Purchasing Order</h3>

                  <div class="space-y-3">
                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Nomer PO</label>
                      <input
                        type="text"
                        v-model="nomerPO"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Nomer PO Contoh (1234/12/11C30/2024)"
                      />
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Tanggal Pengadaan</label>
                      <div class="relative w-3/4">
                        <input
                          type="date"
                          v-model="tanggalPengadaan"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Jenis Pengadaan</label>
                      <div class="relative w-3/4">
                        <select
                          v-model="jenisPengadaan"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                        >
                          <option>Beras</option>
                          <option>Jagung</option>
                          <option>Kedelai</option>
                        </select>
                        <div class="absolute right-3 top-3 text-gray-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Kuantum</label>                      <div class="relative w-3/4 flex">
                        <input
                          type="text"
                          v-model="kuantum"
                          class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Masukan Jumlah Kuantum"
                        />
                        <select
                          v-model="satuan"
                          class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="KG">KG</option>
                          <option value="Liter">Liter</option>
                          <option value="PCS">PCS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Data IN Section -->
                <div class="mb-8 mt-6 p-4 rounded-lg form-section">
                  <h3 class="font-medium text-lg mb-4">Data IN</h3>
                  
                  <!-- Dynamic rows -->
                  <div v-for="(item, index) in dataIN" :key="index" class="flex items-center mb-4 space-x-2">
                    <div class="flex-none w-10 h-10 bg-white rounded-md flex items-center justify-center border border-gray-300">
                      <span>{{ index + 1 }}</span>
                    </div>
                    <div class="flex-none w-44 sm:w-56">
                      <div class="relative">
                        <input
                          type="date"
                          v-model="dataIN[index].tanggal"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div class="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 w-48">
                      <div class="flex">
                        <input
                          type="text"
                          v-model="dataIN[index].kuantum"
                          class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Masukan Jumlah Kuantum"
                        />                        <select
                          v-model="dataIN[index].satuan"
                          class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled
                        >
                          <option :value="satuan">{{ satuan }}</option>
                        </select>
                      </div>
                    </div>
                    
                    <!-- Optional: Delete button -->
                    <button 
                      @click="dataIN.length > 1 ? dataIN.splice(index, 1) : ''" 
                      class="text-red-500 hover:text-red-700"
                      type="button"
                      title="Hapus baris"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Add Row button -->
                  <div class="flex justify-center mt-2">
                    <button 
                      @click="addDataInRow" 
                      type="button"
                      class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      Tambah Baris
                    </button>
                  </div>
                </div>

                <!-- Informasi Pembayaran Section -->
                <div class="mb-8 form-section">
                  <h3 class="font-medium text-lg mb-4">Informasi Pembayaran</h3>
                  
                  <div class="space-y-3">                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Jumlah Pembayaran</label>
                      <input
                        type="text"
                        :value="formatRupiahInput(jumlahPembayaran)"
                        @input="jumlahPembayaran = extractNumericValue($event.target.value)"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Jumlah Pembayaran"
                      />
                    </div>
                    
                    <div class="flex flex-row items-center">
                      <label class="block text-gray-700 w-1/4">Jumlah di-SPP</label>
                      <input
                        type="text"
                        :value="formatRupiahInput(jumlahSPP)"
                        @input="jumlahSPP = extractNumericValue($event.target.value)"
                        class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Masukan Jumlah di-SPP"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="px-6 py-4 bg-white z-10 flex justify-end space-x-4">
              <button 
                @click="clearForm"
                class="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors form-button"
              >
                Clear
              </button>
              <button 
                @click="saveForm"
                class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors form-button"
              >
                Save
              </button>
            </div>
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