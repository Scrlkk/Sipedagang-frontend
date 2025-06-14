<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'

  const props = defineProps({
    isEditMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['form-changed'])

  const namaSupplier = ref('')
  const namaPerusahaan = ref('')
  const jenisBank = ref('')
  const nomorRekening = ref('')
  const nomorPO = ref('')
  const tanggalPengadaan = ref('')
  const jenisPengadaan = ref('')
  const kuantum = ref('')
  const satuanKuantum = ref('KG')
  const jumlahPembayaran = ref('')
  const satuanJumlahPembayaran = ref('KG')
  const jumlahSPP = ref('')
  const satuanJumlahSPP = ref('KG')

  const pengadaanStore = usePengadaanStore()

  const hasChanges = ref(false)
  const initialFormData = ref({})

  const saveInitialData = () => {
    initialFormData.value = {
      namaSupplier: namaSupplier.value,
      namaPerusahaan: namaPerusahaan.value,
      jenisBank: jenisBank.value,
      nomorRekening: nomorRekening.value,
      nomorPO: nomorPO.value,
      tanggalPengadaan: tanggalPengadaan.value,
      jenisPengadaan: jenisPengadaan.value,
      kuantum: kuantum.value,
      satuanKuantum: satuanKuantum.value,
      jumlahPembayaran: jumlahPembayaran.value,
      satuanJumlahPembayaran: satuanJumlahPembayaran.value,
      jumlahSPP: jumlahSPP.value,
      satuanJumlahSPP: satuanJumlahSPP.value,
      dataInList: JSON.parse(JSON.stringify(dataInList.value)),
    }
    hasChanges.value = false
    emit('form-changed', false)
  }

  const checkForChanges = () => {
    const currentData = {
      namaSupplier: namaSupplier.value,
      namaPerusahaan: namaPerusahaan.value,
      jenisBank: jenisBank.value,
      nomorRekening: nomorRekening.value,
      nomorPO: nomorPO.value,
      tanggalPengadaan: tanggalPengadaan.value,
      jenisPengadaan: jenisPengadaan.value,
      kuantum: kuantum.value,
      satuanKuantum: satuanKuantum.value,
      jumlahPembayaran: jumlahPembayaran.value,
      satuanJumlahPembayaran: satuanJumlahPembayaran.value,
      jumlahSPP: jumlahSPP.value,
      satuanJumlahSPP: satuanJumlahSPP.value,
      dataInList: JSON.parse(JSON.stringify(dataInList.value)),
    }

    const hasFormChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialFormData.value)
    hasChanges.value = hasFormChanges
    emit('form-changed', hasFormChanges)
  }

  function clearForm() {
    namaSupplier.value = ''
    namaPerusahaan.value = ''
    jenisBank.value = ''
    nomorRekening.value = ''
    nomorPO.value = ''
    tanggalPengadaan.value = ''
    jenisPengadaan.value = ''
    kuantum.value = ''
    satuanKuantum.value = 'KG'
    jumlahPembayaran.value = ''
    satuanJumlahPembayaran.value = 'KG'
    jumlahSPP.value = ''
    satuanJumlahSPP.value = 'KG'
    dataInList.value = [{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }]
    pengadaanStore.clearMessages()

    nextTick(() => {
      saveInitialData()
    })
  }

  // Function untuk populate form dengan data API
  function populateForm(data) {
    namaSupplier.value = data.nama_suplier || ''
    namaPerusahaan.value = data.nama_perusahaan || ''
    jenisBank.value = data.jenis_bank || ''
    nomorRekening.value = data.no_rekening || ''
    nomorPO.value = data.no_preorder || ''
    tanggalPengadaan.value = data.tanggal_pengadaan || ''
    jenisPengadaan.value = data.jenis_pengadaan_barang || ''

    // Parse kuantum (format: "500 KG")
    if (data.kuantum) {
      const kuantumParts = data.kuantum.split(' ')
      kuantum.value = kuantumParts[0] || ''
      satuanKuantum.value = kuantumParts[1] || 'KG'
    } else {
      kuantum.value = ''
      satuanKuantum.value = 'KG'
    }

    // Parse jumlah pembayaran (format: "10 KG")
    if (data.jumlah_pembayaran) {
      const pembayaranParts = data.jumlah_pembayaran.split(' ')
      jumlahPembayaran.value = pembayaranParts[0] || ''
      satuanJumlahPembayaran.value = pembayaranParts[1] || 'KG'
    } else {
      jumlahPembayaran.value = ''
      satuanJumlahPembayaran.value = 'KG'
    }

    // ✅ Parse SPP dengan pengecekan yang lebih ketat
    if (data.spp && typeof data.spp === 'string' && data.spp.trim() !== '') {
      const sppParts = data.spp.split(' ')
      jumlahSPP.value = sppParts[0] || ''
      satuanJumlahSPP.value = sppParts[1] || 'KG'
    } else {
      // ✅ Reset ke default jika SPP kosong atau tidak valid
      jumlahSPP.value = ''
      satuanJumlahSPP.value = 'KG'
    }

    // Populate Data IN
    let inDataArr = []
    if (data.in_data) {
      if (Array.isArray(data.in_data)) {
        inDataArr = data.in_data
      } else if (typeof data.in_data === 'string') {
        try {
          inDataArr = JSON.parse(data.in_data)
        } catch (e) {
          console.warn('Error parsing in_data JSON:', e)
          inDataArr = []
        }
      }
    }

    // ✅ Map data IN dengan pengecekan yang lebih ketat
    dataInList.value = inDataArr.map((item) => {
      let jumlah = ''
      let satuan = 'KG'

      // Parse kuantum_in dengan pengecekan
      if (
        item.kuantum_in &&
        typeof item.kuantum_in === 'string' &&
        item.kuantum_in.trim() !== ''
      ) {
        const kuantumParts = item.kuantum_in.split(' ')
        jumlah = kuantumParts[0] || ''
        satuan = kuantumParts[1] || 'KG'
      }

      return {
        no_in: item.no_in || '',
        tanggal: item.tanggal_in || '',
        jumlah: jumlah,
        satuan: satuan,
      }
    })

    // Jika kosong, tambahkan satu baris kosong
    if (dataInList.value.length === 0) {
      dataInList.value.push({
        no_in: '',
        tanggal: '',
        jumlah: '',
        satuan: 'KG',
      })
    }

    // ✅ Simpan initial data setelah populate
    nextTick(() => {
      saveInitialData()
    })
  }

  function clearFormWithDelay(delay = 1000) {
    setTimeout(() => {
      clearForm()
    }, delay)
  }

  function getFormData() {
    const formData = {
      nama_suplier: namaSupplier.value,
      nama_perusahaan: namaPerusahaan.value,
      jenis_bank: jenisBank.value,
      no_rekening: nomorRekening.value,
      no_preorder: nomorPO.value,
      tanggal_pengadaan: tanggalPengadaan.value,
      jenis_pengadaan_barang: jenisPengadaan.value,
      kuantum: `${kuantum.value} ${satuanKuantum.value}`,
      jumlah_pembayaran: `${jumlahPembayaran.value} ${satuanJumlahPembayaran.value}`,
      ...(jumlahSPP.value &&
        jumlahSPP.value.trim() !== '' && {
          spp: `${jumlahSPP.value} ${satuanJumlahSPP.value}`,
        }),
      in_data: dataInList.value
        .filter((row) => row.no_in && row.tanggal && row.jumlah)
        .map((row) => ({
          no_in: row.no_in,
          kuantum_in: `${row.jumlah} ${row.satuan}`,
          tanggal_in: row.tanggal,
        })),
    }

    return formData
  }

  function validateForm() {
    const errors = []

    if (!namaSupplier.value) errors.push('Nama Supplier harus diisi')
    if (!namaPerusahaan.value) errors.push('Nama Perusahaan harus diisi')
    if (!jenisBank.value) errors.push('Jenis Bank harus diisi')
    if (!nomorRekening.value) errors.push('Nomor Rekening harus diisi')
    if (!nomorPO.value) errors.push('Nomor PO harus diisi')
    if (!tanggalPengadaan.value) errors.push('Tanggal Pengadaan harus diisi')
    if (!jenisPengadaan.value) errors.push('Jenis Pengadaan harus diisi')
    if (!kuantum.value) errors.push('Kuantum harus diisi')
    if (!jumlahPembayaran.value || jumlahPembayaran.value <= 0) {
      errors.push('Jumlah Pembayaran harus diisi dan lebih dari 0')
    }
    return errors
  }

  // Function untuk submit form (create)
  async function submitForm() {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    const formData = getFormData()
    const result = await pengadaanStore.createPengadaan(formData)

    if (result) {
      clearFormWithDelay(1000)
    }

    return result
  }

  // Function untuk update form (edit)
  async function updateForm(id) {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    const formData = getFormData()
    const result = await pengadaanStore.updatePengadaan(id, formData)

    // ✅ Reset tracking setelah berhasil update
    if (result) {
      nextTick(() => {
        saveInitialData()
      })
    }

    return result
  }

  // ✅ Expose functions untuk dapat diakses parent
  defineExpose({
    clearForm,
    getFormData,
    clearFormWithDelay,
    validateForm,
    submitForm,
    updateForm,
    populateForm,
    pengadaanStore,
    hasChanges,
    saveInitialData,
  })

  // DATA IN
  const maxDataIn = 10
  const dataInList = ref([{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }])

  function addDataInRow() {
    if (dataInList.value.length < maxDataIn) {
      dataInList.value.push({
        no_in: '',
        tanggal: '',
        jumlah: '',
        satuan: 'KG',
      })
    }
  }

  function removeDataInRow(idx) {
    if (dataInList.value.length > 1) {
      dataInList.value.splice(idx, 1)
    } else {
      // Jika hanya satu baris, kosongkan saja
      dataInList.value = [{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }]
    }
  }

  // ✅ Watch untuk perubahan form (tambah satuanJumlahSPP)
  watch(
    [
      namaSupplier,
      namaPerusahaan,
      jenisBank,
      nomorRekening,
      nomorPO,
      tanggalPengadaan,
      jenisPengadaan,
      kuantum,
      satuanKuantum,
      jumlahPembayaran,
      satuanJumlahPembayaran,
      jumlahSPP,
      satuanJumlahSPP, // ✅ Tambah watch untuk satuan SPP
      dataInList,
    ],
    () => {
      checkForChanges()
    },
    { deep: true },
  )

  watch(satuanKuantum, (val) => {
    setAllSatuan(val)
  })

  // Watch satuan Jumlah Pembayaran
  watch(satuanJumlahPembayaran, (val) => {
    setAllSatuan(val)
  })

  // ✅ Watch satuan SPP
  watch(satuanJumlahSPP, (val) => {
    setAllSatuan(val)
  })

  // Watch setiap perubahan satuan pada Data IN
  watch(
    dataInList,
    (list) => {
      // Jika ada perubahan satuan pada salah satu row, samakan semua
      if (list.length > 0) {
        const firstSatuan = list[0].satuan
        const allSame = list.every((row) => row.satuan === firstSatuan)
        if (!allSame) {
          setAllSatuan(firstSatuan)
        }
      }
    },
    { deep: true },
  )

  // ✅ Fungsi untuk menyamakan semua satuan (tambah satuanJumlahSPP)
  function setAllSatuan(newSatuan) {
    satuanKuantum.value = newSatuan
    satuanJumlahPembayaran.value = newSatuan
    satuanJumlahSPP.value = newSatuan // ✅ Sinkronisasi satuan SPP
    dataInList.value.forEach((row) => (row.satuan = newSatuan))
  }

  // ✅ Set initial data saat mounted untuk form baru
  onMounted(() => {
    if (!props.isEditMode) {
      nextTick(() => {
        saveInitialData()
      })
    }
  })
</script>

<template>
  <section
    class="flex flex-col gap-4 mt-4 sm:mt-6 overflow-y-auto w-full h-full pb-3 px-2 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}]"
  >
    <!-- DATA PEMOHON -->
    <div class="font-bold text-lg sm:text-xl">Data Pemohon</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="nama-supplier"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Nama Supplier <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nama-supplier"
          placeholder="Masukkan nama supplier"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="namaSupplier"
          required
        />
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="nama-perusahaan"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Nama Perusahaan <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nama-perusahaan"
          placeholder="Masukkan nama perusahaan"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="namaPerusahaan"
          required
        />
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="jenis-bank"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Jenis Bank <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="jenis-bank"
            placeholder="Masukkan jenis bank"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full bg-white appearance-none cursor-pointer text-sm sm:text-base"
            v-model="jenisBank"
            required
          />
          <div
            class="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none"
          ></div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="nomor-rekening"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Nomor Rekening <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nomor-rekening"
          placeholder="Masukkan nomor rekening"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="nomorRekening"
          required
        />
      </div>
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="atas-nama-rekening"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Atas Nama Rekening <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="atas-nama-rekening"
          placeholder="Masukkan nama pemilik rekening"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          required
        />
      </div>
    </div>
  </section>
</template>
