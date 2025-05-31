<script setup>
  // Define props with default values
  const props = defineProps({
    // Form data properties
    namaSupplier: { type: String, default: '' },
    namaPerusahaan: { type: String, default: '' },
    jenisBank: { type: String, default: 'Mandiri' },
    nomerRekening: { type: String, default: '' },
    nomerPO: { type: String, default: '' },
    tanggalPengadaan: { type: String, default: '' },
    jenisPengadaan: { type: String, default: 'Beras' },
    kuantum: { type: String, default: '' },
    satuan: { type: String, default: 'KG' },
    dataIN: {
      type: Array,
      default: () => [{ tanggal: '', kuantum: '', satuan: 'KG' }],
    },
    jumlahPembayaran: { type: String, default: '' },
    jumlahSPP: { type: String, default: '' },

    // UI configuration
    layoutType: { type: String, default: 'admin' },
    showNavigation: { type: Boolean, default: true },
    formattedPembayaran: { type: String, default: '' },
    formattedSPP: { type: String, default: '' },
  })

  // Define emits for all form interactions
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
    'save-form',
  ])

  // Helper methods for UI formatting (these are UI-specific, so can stay in the component)
  const formatRupiah = (value) => {
    if (!value) return ''
    return 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Create a safe method to update dataIN array without reactivity issues
  const updateDataIN = (index, field, value) => {
    // Create a deep copy of the array to ensure Vue tracks the changes properly
    const updatedDataIN = JSON.parse(JSON.stringify(props.dataIN))
    // Update the specific field in the specific row
    updatedDataIN[index][field] = value
    // Emit the updated array
    emit('update:dataIN', updatedDataIN)
  }
</script>

<template>
  <div class="w-full max-w-5xl mx-auto px-2 sm:px-4">
    <div
      class="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[82vh] sm:max-h-[80vh] border border-gray-100 form-card"
    >
      <!-- Form Header -->
      <div class="text-center pb-2 bg-white z-10 flex-shrink-0">
        <h1
          class="text-lg sm:text-xl font-medium mt-4 sm:mt-6 mb-1 form-title"
          style="color: #0099ff"
        >
          Form Input Data
        </h1>
        <div
          class="mx-auto form-divider"
          style="
            height: 3px;
            background-color: #0099ff;
            width: 100%;
            max-width: 200px;
            margin-bottom: 16px;
          "
        ></div>
      </div>

      <!-- Scrollable Form Content -->
      <div
        class="overflow-y-auto flex-grow min-h-0"
        role="main"
        aria-label="Form input data permohonan"
      >
        <div class="p-3 sm:p-6 pb-2 sm:pb-6">
          <!-- Data Pemohon Section -->
          <fieldset class="mb-4 sm:mb-6 form-section">
            <legend class="font-medium text-base sm:text-lg mb-4 text-gray-900">
              Data Pemohon
            </legend>

            <div class="space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="namaSupplier"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Nama Supplier
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <input
                  id="namaSupplier"
                  type="text"
                  :value="namaSupplier"
                  @input="emit('update:namaSupplier', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Nama Supplier"
                  required
                  aria-describedby="namaSupplier-help"
                />
                <div id="namaSupplier-help" class="sr-only">
                  Masukkan nama supplier yang mengajukan permohonan
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="namaPerusahaan"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Nama Perusahaan
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <input
                  id="namaPerusahaan"
                  type="text"
                  :value="namaPerusahaan"
                  @input="emit('update:namaPerusahaan', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Nama Perusahaan"
                  required
                  aria-describedby="namaPerusahaan-help"
                />
                <div id="namaPerusahaan-help" class="sr-only">
                  Masukkan nama perusahaan supplier
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="jenisBank"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Jenis Bank
                </label>
                <div class="relative w-full sm:w-3/4">
                  <select
                    id="jenisBank"
                    :value="jenisBank"
                    @change="emit('update:jenisBank', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent appearance-none text-sm sm:text-base"
                    aria-describedby="jenisBank-help"
                  >
                    <option value="Mandiri">Mandiri</option>
                    <option value="BCA">BCA</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                    <option value="CIMB Niaga">CIMB Niaga</option>
                    <option value="BTN">BTN</option>
                    <option value="Permata">Permata</option>
                  </select>
                  <div
                    class="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
                <div id="jenisBank-help" class="sr-only">
                  Pilih jenis bank untuk rekening supplier
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="nomerRekening"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Nomer Rekening
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <input
                  id="nomerRekening"
                  type="text"
                  :value="nomerRekening"
                  @input="emit('update:nomerRekening', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Nomer Rekening"
                  required
                  aria-describedby="nomerRekening-help"
                />
                <div id="nomerRekening-help" class="sr-only">
                  Masukkan nomor rekening bank supplier
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Detail Purchasing Order Section -->
          <fieldset class="mb-4 sm:mb-6 form-section">
            <legend class="font-medium text-base sm:text-lg mb-4 text-gray-900">
              Detail Purchasing Order
            </legend>

            <div class="space-y-3">
              <!-- PO Number -->
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="nomerPO"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Nomer PO
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <input
                  id="nomerPO"
                  type="text"
                  :value="nomerPO"
                  @input="emit('update:nomerPO', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Nomer PO Contoh (1234/12/11C30/2024)"
                  required
                  aria-describedby="nomerPO-help"
                />
                <div id="nomerPO-help" class="sr-only">
                  Masukkan nomor Purchase Order sesuai format yang ditentukan
                </div>
              </div>

              <!-- Date -->
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="tanggalPengadaan"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Tanggal Pengadaan
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <input
                  id="tanggalPengadaan"
                  type="date"
                  :value="tanggalPengadaan"
                  @input="emit('update:tanggalPengadaan', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  required
                  aria-describedby="tanggalPengadaan-help"
                />
                <div id="tanggalPengadaan-help" class="sr-only">
                  Pilih tanggal pengadaan barang
                </div>
              </div>

              <!-- Jenis Pengadaan -->
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="jenisPengadaan"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Jenis Pengadaan
                </label>
                <div class="relative w-full sm:w-3/4">
                  <select
                    id="jenisPengadaan"
                    :value="jenisPengadaan"
                    @change="emit('update:jenisPengadaan', $event.target.value)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent appearance-none text-sm sm:text-base"
                    aria-describedby="jenisPengadaan-help"
                  >
                    <option value="Beras">Beras</option>
                    <option value="Jagung">Jagung</option>
                    <option value="Kedelai">Kedelai</option>
                  </select>
                  <div
                    class="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
                <div id="jenisPengadaan-help" class="sr-only">
                  Pilih jenis barang yang akan diadakan
                </div>
              </div>

              <!-- Kuantum -->
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="kuantum"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Kuantum
                  <span class="text-red-500" aria-label="wajib diisi">*</span>
                </label>
                <div class="relative w-full sm:w-3/4 flex">
                  <input
                    id="kuantum"
                    type="text"
                    :value="kuantum"
                    @input="emit('update:kuantum', $event.target.value)"
                    class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                    placeholder="Masukan Jumlah Kuantum"
                    required
                    aria-describedby="kuantum-help"
                  />
                  <select
                    id="satuan"
                    :value="satuan"
                    @change="emit('update:satuan', $event.target.value)"
                    class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                    aria-label="Satuan kuantum"
                  >
                    <option value="KG">KG</option>
                    <option value="Liter">Liter</option>
                    <option value="PCS">PCS</option>
                  </select>
                </div>
                <div id="kuantum-help" class="sr-only">
                  Masukkan jumlah kuantum barang yang akan diadakan
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Data IN Section -->
          <fieldset
            class="mb-4 sm:mb-6 mt-6 p-3 sm:p-4 rounded-lg form-section"
          >
            <legend class="font-medium text-base sm:text-lg mb-4 text-gray-900">
              Data IN
            </legend>

            <!-- Dynamic rows -->
            <div class="space-y-3" role="group" aria-label="Daftar data IN">
              <div
                v-for="(item, index) in dataIN"
                :key="index"
                class="flex items-center space-x-2 p-2 rounded"
              >
                <div
                  class="flex-none w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-md flex items-center justify-center"
                >
                  <span class="text-xs sm:text-sm font-medium">{{
                    index + 1
                  }}</span>
                </div>
                <div class="flex-none w-32 sm:w-44 lg:w-56">
                  <label :for="`tanggal-${index}`" class="sr-only"
                    >Tanggal untuk baris {{ index + 1 }}</label
                  >
                  <input
                    :id="`tanggal-${index}`"
                    type="date"
                    :value="item.tanggal"
                    @input="
                      (e) => updateDataIN(index, 'tanggal', e.target.value)
                    "
                    class="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex">
                    <label :for="`kuantum-${index}`" class="sr-only"
                      >Kuantum untuk baris {{ index + 1 }}</label
                    >
                    <input
                      :id="`kuantum-${index}`"
                      type="text"
                      :value="item.kuantum"
                      @input="
                        (e) => updateDataIN(index, 'kuantum', e.target.value)
                      "
                      class="flex-grow px-2 sm:px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-xs sm:text-sm min-w-0"
                      placeholder="Kuantum"
                    />
                    <select
                      :value="item.satuan"
                      disabled
                      class="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-gray-500 text-xs sm:text-sm"
                      :aria-label="`Satuan untuk baris ${index + 1}, otomatis mengikuti satuan utama`"
                    >
                      <option :value="satuan">{{ satuan }}</option>
                    </select>
                  </div>
                </div>

                <!-- Delete button -->
                <button
                  @click="emit('remove-data-row', index)"
                  class="text-red-500 hover:text-red-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="button"
                  :aria-label="`Hapus baris ${index + 1}`"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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

            <!-- Add Row button -->
            <div class="flex justify-center mt-4">
              <button
                @click="emit('add-data-row')"
                type="button"
                class="flex items-center px-3 sm:px-4 py-2 bg-[#0099FF] text-white rounded-md hover:bg-[#0088EE] focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:ring-offset-2 transition-colors text-xs sm:text-sm"
                aria-label="Tambah baris baru untuk data IN"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Tambah Baris
              </button>
            </div>
          </fieldset>

          <!-- Informasi Pembayaran Section -->
          <fieldset class="mb-4 sm:mb-6 form-section">
            <legend class="font-medium text-base sm:text-lg mb-4 text-gray-900">
              Informasi Pembayaran
            </legend>

            <div class="space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="jumlahPembayaran"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Jumlah Pembayaran
                </label>
                <input
                  id="jumlahPembayaran"
                  type="text"
                  :value="formattedPembayaran"
                  @input="emit('update:jumlahPembayaran', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Jumlah Pembayaran"
                  aria-describedby="jumlahPembayaran-help"
                />
                <div id="jumlahPembayaran-help" class="sr-only">
                  Masukkan jumlah pembayaran dalam rupiah
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center">
                <label
                  for="jumlahSPP"
                  class="block text-gray-700 sm:w-1/4 mb-1 sm:mb-0 text-sm sm:text-base font-medium"
                >
                  Jumlah di-SPP
                </label>
                <input
                  id="jumlahSPP"
                  type="text"
                  :value="formattedSPP"
                  @input="emit('update:jumlahSPP', $event.target.value)"
                  class="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent text-sm sm:text-base"
                  placeholder="Masukan Jumlah di-SPP"
                  aria-describedby="jumlahSPP-help"
                />
                <div id="jumlahSPP-help" class="sr-only">
                  Masukkan jumlah dalam SPP (Surat Permintaan Pembayaran)
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Form Action Buttons - Fixed at bottom -->
      <div
        class="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-100 z-10 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4"
      >
        <button
          @click="emit('clear-form')"
          type="button"
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors form-button text-sm sm:text-base"
          aria-label="Bersihkan semua data form"
        >
          Clear
        </button>
        <button
          @click="emit('save-form')"
          type="button"
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#0099FF] text-white rounded-md hover:bg-[#0088EE] focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:ring-offset-2 transition-colors form-button text-sm sm:text-base"
          aria-label="Simpan data form"
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

  /* Remove dropdown arrow from select elements */
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: none !important;
  }

  select::-ms-expand {
    display: none;
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
