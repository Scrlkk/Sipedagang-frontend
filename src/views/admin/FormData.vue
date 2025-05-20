<script setup>
  import { ref, watch } from 'vue'
  import AdminLayout from '@/layouts/AdminLayout.vue'
  import FormComponent from '@/components/FormComponent.vue'
  import { useRouter } from 'vue-router'
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

  // Data IN
  const dataIN = ref([{ tanggal: '', kuantum: '', satuan: 'KG' }])

  // Watch satuan changes and update all dataIN rows
  watch(satuan, (newSatuan) => {
    dataIN.value.forEach((row) => {
      row.satuan = newSatuan
    })
  })

  // Informasi Pembayaran
  const jumlahPembayaran = ref('')
  const jumlahSPP = ref('')

  // Formatted values for Rupiah display
  const formattedPembayaran = ref('')
  const formattedSPP = ref('')

  // Function to format value as Rupiah in input fields
  const formatRupiahInput = (value) => {
    if (!value) return ''

    // Remove all non-numeric characters
    let number = value.toString().replace(/[^\d]/g, '')

    // Format the number with thousand separators
    return 'Rp ' + number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Function to extract numeric value from formatted Rupiah string
  const extractNumericValue = (rupiahString) => {
    if (!rupiahString) return ''
    return rupiahString.replace(/[^\d]/g, '')
  }

  // Update formatted values when raw values change
  watch(jumlahPembayaran, (newValue) => {
    formattedPembayaran.value = formatRupiahInput(newValue)
  })

  watch(jumlahSPP, (newValue) => {
    formattedSPP.value = formatRupiahInput(newValue)
  })

  // Handle Rupiah input
  const handlePembayaranInput = (value) => {
    jumlahPembayaran.value = extractNumericValue(value)
  }

  const handleSPPInput = (value) => {
    jumlahSPP.value = extractNumericValue(value)
  }

  // Form actions
  const clearForm = () => {
    namaSupplier.value = ''
    namaPerusahaan.value = ''
    jenisBank.value = 'Mandiri'
    nomerRekening.value = ''
    nomerPO.value = ''
    tanggalPengadaan.value = ''
    jenisPengadaan.value = 'Beras'
    kuantum.value = ''
    satuan.value = 'KG'

    // Keep just one empty row when clearing with the default satuan
    dataIN.value = [{ tanggal: '', kuantum: '', satuan: 'KG' }]

    jumlahPembayaran.value = ''
    jumlahSPP.value = ''
    formattedPembayaran.value = ''
    formattedSPP.value = ''
  }

  // Validation functions
  const validateForm = () => {
    // Check if any Data IN row has an empty tanggal (date) field
    const emptyDateFound = dataIN.value.some((item) => !item.tanggal)

    // Validate all essential fields including Data IN dates
    if (
      !namaSupplier.value ||
      !namaPerusahaan.value ||
      !nomerRekening.value ||
      !nomerPO.value ||
      !tanggalPengadaan.value ||
      !kuantum.value ||
      emptyDateFound
    ) {
      Swal.fire({
        title: 'Data Tidak Lengkap',
        text: 'Mohon lengkapi semua field yang diperlukan',
        icon: 'warning',
        confirmButtonColor: '#0099FF',
        confirmButtonText: 'Ok',
      })
      return false
    }

    // Validate satuan consistency
    let isDataINValid = true
    dataIN.value.forEach((item) => {
      if (item.kuantum && item.satuan !== satuan.value) {
        isDataINValid = false
      }
    })

    if (!isDataINValid) {
      Swal.fire({
        title: 'Satuan Tidak Konsisten',
        text: 'Satuan pada Data IN harus sama dengan satuan pada Kuantum',
        icon: 'warning',
        confirmButtonColor: '#0099FF',
        confirmButtonText: 'Ok',
      })
      return false
    }

    return true
  }

  // Function to add a new row to dataIN
  const addDataInRow = () => {
    if (dataIN.value.length >= 10) {
      // Show SweetAlert notification
      Swal.fire({
        title: 'Batas Maksimum',
        text: `Maksimum Untuk Data IN hanya 10 baris`,
        icon: 'warning',
        confirmButtonColor: '#0099FF',
        confirmButtonText: 'Oke',
      })
      return // Exit the function without adding a row
    }

    // If under the limit, add a new row with the current satuan value
    dataIN.value.push({ tanggal: '', kuantum: '', satuan: satuan.value })
  }

  // Function to remove a row from dataIN
  const removeDataRow = (index) => {
    if (dataIN.value.length > 1) {
      dataIN.value.splice(index, 1)
    }
  }

  // Save form data when the form emits save event
  const saveForm = () => {
    // First validate the form
    if (!validateForm()) return

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
      jumlahSPP: jumlahSPP.value,
    }

    // Also save to the permohonanDataList for LihatData.vue
    // First, check if there's an existing list
    let dataList = []
    const savedDataList = localStorage.getItem('permohonanDataList')
    if (savedDataList) {
      dataList = JSON.parse(savedDataList)
    }

    // Format tanggal for the table view
    const date = new Date(tanggalPengadaan.value)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const tanggalFormatted = `${day}/${month}/${year}`

    // Create a table entry
    const newEntry = {
      jenisPengadaan: jenisPengadaan.value,
      noProorder: nomerPO.value,
      supplier: namaSupplier.value,
      perusahaan: namaPerusahaan.value,
      kuantum: `${kuantum.value} ${satuan.value}`,
      tanggal: tanggalFormatted,
      rawData: formData, // Store the complete form data for preview
    }

    // Add to the list and save
    dataList.push(newEntry)
    localStorage.setItem('permohonanDataList', JSON.stringify(dataList))
    // Show success message
    Swal.fire({
      title: 'Berhasil!',
      text: 'Data berhasil disimpan',
      icon: 'success',
      confirmButtonColor: '#0099FF',
      confirmButtonText: 'Lihat Data',
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to lihatdata page
        // Note: We keep this programmatic navigation since it's inside an event handler
        // But other component-based navigation should use router-link
        router.push('/admin/lihatdata')
      }
    })
  }

  // Preview functionality has been removed
</script>

<template>
  <AdminLayout class="h-screen overflow-hidden">
    <!-- Add transition wrapper -->
    <transition name="page" appear>
      <div
        class="flex items-center justify-center min-h-[calc(80vh-120px)] py-6"
      >
        <!-- Side Navigation (unchanged) -->
        <div
          class="fixed left-8 lg:left-1/6 top-1/3 flex flex-col space-y-4 z-20"
        >
          <router-link
            to="/admin/dashboard"
            class="bg-[#0099FF] text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-[#0088EE] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
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
          </router-link>
          <router-link
            to="/admin/lihatdata"
            class="bg-[#0099FF] text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-[#0088EE] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </router-link>
        </div>

        <!-- Using our reusable component with v-model bindings -->
        <FormComponent
          :namaSupplier="namaSupplier"
          @update:namaSupplier="namaSupplier = $event"
          :namaPerusahaan="namaPerusahaan"
          @update:namaPerusahaan="namaPerusahaan = $event"
          :jenisBank="jenisBank"
          @update:jenisBank="jenisBank = $event"
          :nomerRekening="nomerRekening"
          @update:nomerRekening="nomerRekening = $event"
          :nomerPO="nomerPO"
          @update:nomerPO="nomerPO = $event"
          :tanggalPengadaan="tanggalPengadaan"
          @update:tanggalPengadaan="tanggalPengadaan = $event"
          :jenisPengadaan="jenisPengadaan"
          @update:jenisPengadaan="jenisPengadaan = $event"
          :kuantum="kuantum"
          @update:kuantum="kuantum = $event"
          :satuan="satuan"
          @update:satuan="satuan = $event"
          :dataIN="dataIN"
          @update:dataIN="dataIN = $event"
          :jumlahPembayaran="jumlahPembayaran"
          @update:jumlahPembayaran="handlePembayaranInput($event)"
          :jumlahSPP="jumlahSPP"
          @update:jumlahSPP="handleSPPInput($event)"
          :formattedPembayaran="formattedPembayaran"
          :formattedSPP="formattedSPP"
          @add-data-row="addDataInRow"
          @remove-data-row="removeDataRow"
          @clear-form="clearForm"
          @save-form="saveForm"
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
</style>
