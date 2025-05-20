<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  // Initial data untuk form
  initialData: {
    type: Object,
    default: () => ({})
  },
  // Key untuk local storage
  dataKey: {
    type: String,
    default: 'permohonanDataList'
  },
  // Konfigurasi untuk storage item
  formDataKey: {
    type: String,
    default: 'permohonanFormData'
  },
  // Max baris untuk Data IN
  maxDataInRows: {
    type: Number,
    default: 10
  },
  // Layout admin atau superadmin
  userType: {
    type: String,
    default: 'admin'
  },
  namaSupplier: { type: String, default: '' },
  namaPerusahaan: { type: String, default: '' },
  jenisBank: { type: String, default: 'Mandiri' },
  nomerRekening: { type: String, default: '' },
  nomerPO: { type: String, default: '' },
  tanggalPengadaan: { type: String, default: '' },
  jenisPengadaan: { type: String, default: 'Beras' },
  kuantum: { type: String, default: '' },
  satuan: { type: String, default: 'KG' },
  dataIN: { type: Array, default: () => [{ tanggal: '', kuantum: '', satuan: 'KG' }] },
  jumlahPembayaran: { type: String, default: '' },
  jumlahSPP: { type: String, default: '' },
  formattedPembayaran: { type: String, default: '' },
  formattedSPP: { type: String, default: '' }
})

const emit = defineEmits([
  'update:namaSupplier',
  'update:namaPerusahaan',
  'update:jenisBank',
  'update:nomerRekening',
  'update:nomerPO',
  'update:tanggalPengadaan',
  'update:jenisPengadaan',
  'update:kuantum',
  'update:satuan',
  'update:dataIN',
  'update:jumlahPembayaran',
  'update:jumlahSPP',
  'add-data-row',
  'remove-data-row',
  'clear-form',
  'save-form'
])

const formatRupiah = (value) => {
  if (!value) return '';
  return 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const updateDataIN = (index, field, value) => {
  const updatedDataIN = JSON.parse(JSON.stringify(props.dataIN));
  updatedDataIN[index][field] = value;
  emit('update:dataIN', updatedDataIN);
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto px-4">
    <div class="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[80vh] border border-gray-100 form-card">
      <!-- Form Header -->      <div class="text-center pb-2 bg-white z-10">
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
                  :value="namaSupplier"
                  @input="$emit('update:namaSupplier', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  placeholder="Masukan Nama Supplier"
                />
              </div>

              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Nama Perusahaan</label>
                <input
                  type="text"
                  :value="namaPerusahaan"
                  @input="$emit('update:namaPerusahaan', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  placeholder="Masukan Nama Perusahaan"
                />
              </div>

              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Jenis Bank</label>                <div class="relative w-3/4">
                  <select
                    :value="jenisBank"
                    @change="$emit('update:jenisBank', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF] appearance-none"
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
                  :value="nomerRekening"
                  @input="$emit('update:nomerRekening', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
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
                  :value="nomerPO"
                  @input="$emit('update:nomerPO', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  placeholder="Masukan Nomer PO Contoh (1234/12/11C30/2024)"
                />
              </div>

              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Tanggal Pengadaan</label>
                <div class="relative w-3/4">
                  <input
                    type="date"
                    :value="tanggalPengadaan"
                    @input="$emit('update:tanggalPengadaan', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  />
                </div>
              </div>

              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Jenis Pengadaan</label>                <div class="relative w-3/4">
                  <select
                    :value="jenisPengadaan"
                    @change="$emit('update:jenisPengadaan', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF] appearance-none"
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
                <label class="block text-gray-700 w-1/4">Kuantum</label>
                <div class="relative w-3/4 flex">
                  <input
                    type="text"
                    :value="kuantum"
                    @input="$emit('update:kuantum', $event.target.value)"
                    class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                    placeholder="Masukan Jumlah Kuantum"
                  />                  <select
                    :value="satuan"
                    @change="$emit('update:satuan', $event.target.value)"
                    class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
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
                    :value="item.tanggal"
                    @input="updateDataIN(index, 'tanggal', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
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
                    :value="item.kuantum"
                    @input="updateDataIN(index, 'kuantum', $event.target.value)"
                    class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                    placeholder="Masukan Jumlah Kuantum"
                  />                  <select
                    :value="item.satuan"
                    @change="updateDataIN(index, 'satuan', $event.target.value)"
                    class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  >
                    <option value="KG">KG</option>
                    <option value="Liter">Liter</option>
                    <option value="PCS">PCS</option>
                  </select>
                </div>
              </div>
              
              <!-- Optional: Delete button -->
              <button 
                @click="dataIN.length > 1 ? emit('remove-data-row', index) : ''" 
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
                @click="$emit('add-data-row')" 
                type="button"
                class="flex items-center px-4 py-2 bg-[#0099FF] text-white rounded-md hover:bg-[#0088EE] transition-colors text-sm"
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
            
            <div class="space-y-3">
              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Jumlah Pembayaran</label>
                <input
                  type="text"
                  :value="formatRupiah(jumlahPembayaran)"
                  @input="$emit('update:jumlahPembayaran', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                  placeholder="Masukan Jumlah Pembayaran"
                />
              </div>
              
              <div class="flex flex-row items-center">
                <label class="block text-gray-700 w-1/4">Jumlah di-SPP</label>
                <input
                  type="text"
                  :value="formatRupiah(jumlahSPP)"
                  @input="$emit('update:jumlahSPP', $event.target.value)"
                  class="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
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
          @click="$emit('clear-form')"
          class="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors form-button"
        >
          Clear
        </button>
        <button 
          @click="$emit('save-form')"
          class="px-6 py-2 bg-[#0099FF] text-white rounded-md hover:bg-[#0088EE] transition-colors form-button"
        >
          Save
        </button>
      </div>
    </div>
  </div>
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