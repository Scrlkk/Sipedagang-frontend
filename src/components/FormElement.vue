<script setup>
  import { ref, watch } from 'vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'

  const props = defineProps({
    isEditMode: {
      type: Boolean,
      default: false,
    },
  })

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

  const pengadaanStore = usePengadaanStore()

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
    dataInList.value = [{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }]
    pengadaanStore.clearMessages()
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
    }

    // Parse jumlah pembayaran (format: "10 KG")
    if (data.jumlah_pembayaran) {
      const pembayaranParts = data.jumlah_pembayaran.split(' ')
      jumlahPembayaran.value = pembayaranParts[0] || ''
      satuanJumlahPembayaran.value = pembayaranParts[1] || 'KG'
    }

    jumlahSPP.value = data.spp || ''

    // Populate Data IN
    let inDataArr = []
    if (data.in_data) {
      if (Array.isArray(data.in_data)) {
        inDataArr = data.in_data
      } else if (typeof data.in_data === 'string') {
        try {
          inDataArr = JSON.parse(data.in_data)
        } catch (e) {
          inDataArr = []
        }
      }
    }
    dataInList.value = inDataArr.map((item) => {
      const kuantumParts = (item.kuantum_in || '').split(' ')
      return {
        no_in: item.no_in || '',
        tanggal: item.tanggal_in || '',
        jumlah: kuantumParts[0] || '',
        satuan: kuantumParts[1] || 'KG',
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
      spp: jumlahSPP.value,
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
    else if (
      !['MANDIRI', 'BCA', 'BRI', 'BANK JATENG', 'BNI'].includes(
        jenisBank.value.toUpperCase(),
      )
    ) {
      errors.push('Jenis Bank harus MANDIRI, BCA, BRI, BANK JATENG, atau BNI')
    }
    if (!nomorRekening.value) errors.push('Nomor Rekening harus diisi')
    if (!nomorPO.value) errors.push('Nomor PO harus diisi')
    if (!tanggalPengadaan.value) errors.push('Tanggal Pengadaan harus diisi')
    if (!jenisPengadaan.value) errors.push('Jenis Pengadaan harus diisi')
    if (!kuantum.value) errors.push('Kuantum harus diisi')
    if (!jumlahPembayaran.value || jumlahPembayaran.value <= 0) {
      errors.push('Jumlah Pembayaran harus diisi dan lebih dari 0')
    }
    if (!jumlahSPP.value) errors.push('Jumlah SPP harus diisi')

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

    return result
  }

  defineExpose({
    clearForm,
    getFormData,
    clearFormWithDelay,
    validateForm,
    submitForm,
    updateForm,
    populateForm,
    pengadaanStore,
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

  watch(satuanKuantum, (val) => {
    setAllSatuan(val)
  })

  // Watch satuan Jumlah Pembayaran
  watch(satuanJumlahPembayaran, (val) => {
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

  // Fungsi untuk menyamakan semua satuan
  function setAllSatuan(newSatuan) {
    satuanKuantum.value = newSatuan
    satuanJumlahPembayaran.value = newSatuan
    dataInList.value.forEach((row) => (row.satuan = newSatuan))
  }
</script>

<template>
  <section
    class="flex flex-col gap-4 mt-4 sm:mt-6 overflow-y-auto w-full h-full pb-3 px-2 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}]"
  >
    <!-- DATA PEMOHON -->
    <div class="font-bold text-lg sm:text-xl">Data Pemohon</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="nama-supplier" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Nama Supplier <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          id="nama-supplier"
          placeholder="Masukkan nama supplier"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="namaSupplier"
          required
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="nama-perusahaan" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Nama Perusahaan <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          id="nama-perusahaan"
          placeholder="Masukkan nama perusahaan"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="namaPerusahaan"
          required
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="jenis-bank" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Jenis Bank <span class="text-red-500">*</span></label
        >
        <div class="relative w-full">
          <select
            id="jenis-bank"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full bg-white appearance-none cursor-pointer text-sm sm:text-base"
            v-model="jenisBank"
            required
          >
            <option value="">Pilih jenis bank</option>
            <option value="MANDIRI">MANDIRI</option>
            <option value="BCA">BCA</option>
            <option value="BRI">BRI</option>
            <option value="BANK JATENG">BANK JATENG</option>
            <option value="BNI">BNI</option>
          </select>
          <div
            class="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none"
          >
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="nomor-rekening" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Nomor Rekening <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          id="nomor-rekening"
          placeholder="Masukkan nomor rekening"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="nomorRekening"
          required
        />
      </div>
    </div>    <!-- DETAIL PURCHASING ORDER -->
    <div class="font-bold text-lg sm:text-xl mt-4">Detail Purchasing Order</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="nomor-po" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Nomor PO <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          id="nomor-po"
          placeholder="Masukkan nomor purchasing order"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="nomorPO"
          required
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="tanggal-pengadaan" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Tanggal Pengadaan <span class="text-red-500">*</span></label
        >
        <input
          type="date"
          id="tanggal-pengadaan"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="tanggalPengadaan"
          required
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="jenis-pengadaan" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Jenis Pengadaan <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          id="jenis-pengadaan"
          placeholder="Masukkan jenis pengadaan (Beras, Gabah, Minyak, atau lainnya)"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="jenisPengadaan"
          required
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="kuantum" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Kuantum <span class="text-red-500">*</span></label
        >
        <div class="relative w-full">
          <input
            type="number"
            id="kuantum"
            placeholder="Masukkan kuantum"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            v-model="kuantum"
            required
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-1 border-[#D9D9D9] my-0.5 pl-2"
          >
            <select
              v-model="satuanKuantum"
              class="text-center text-sm sm:text-md px-1 sm:px-2.5 appearance-none [&::-ms-expand]:hidden [&_::-webkit-select-placeholder]:hidden"
            >
              <option value="KG">KG</option>
              <option value="PCS">PCS</option>
              <option value="LITER">LITER</option>
            </select>
          </div>
        </div>
      </div>
    </div>    <!-- DATA IN -->
    <div class="font-bold text-lg sm:text-xl mt-4 flex gap-x-2 items-center">
      <div>Data IN</div>
      <div class="text-xs sm:text-sm font-normal text-gray-500">(Opsional)</div>
    </div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div
        v-for="(row, idx) in dataInList"
        :key="idx"
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-x-3"
      >        <!-- Nomor IN manual -->
        <input
          type="number"
          v-model="row.no_in"
          min="1"
          class="w-full sm:w-20 md:w-24 h-10 sm:h-12 border-[2.2px] border-[#D9D9D9] rounded-lg px-2 text-center text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="No"
          required
        />
        <input
          type="date"
          v-model="row.tanggal"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
        />
        <div class="relative w-full">
          <input
            type="number"
            v-model="row.jumlah"
            placeholder="Masukkan jumlah (opsional)"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-1 border-[#D9D9D9] my-0.5 pl-2"
          >
            <select
              v-model="row.satuan"
              class="text-center text-sm sm:text-md px-1 sm:px-2.5 appearance-none [&::-ms-expand]:hidden [&_::-webkit-select-placeholder]:hidden"
            >
              <option value="KG">KG</option>
              <option value="PCS">PCS</option>
              <option value="LITER">LITER</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          class="ml-0 sm:ml-2 p-2 rounded hover:bg-red-100 transition self-center sm:self-auto"
          @click="removeDataInRow(idx)"
          v-if="dataInList.length > 1"
          title="Hapus baris"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="flex justify-center w-full">
        <button
          type="button"
          class="mt-2 px-3 sm:px-4 py-2 hover:bg-blue-500 text-white rounded bg-[#0099FF] transition-all duration-200 ease-in-out w-fit text-sm sm:text-base"
          @click="addDataInRow"
          :disabled="dataInList.length >= maxDataIn"
        >
          + Tambah Data IN
        </button>
      </div>
      <div
        v-if="dataInList.length >= maxDataIn"
        class="text-gray-400 text-center text-sm"
      >
        Maksimal 10 baris Data IN.
      </div>
    </div>    <!-- JUMLAH PEMBAYARAN -->
    <div class="font-bold text-lg sm:text-xl mt-4">Informasi Pembayaran</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="jumlah-pembayaran" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Jumlah Pembayaran <span class="text-red-500">*</span></label
        >
        <div class="relative w-full">
          <input
            type="number"
            id="jumlah-pembayaran"
            placeholder="Masukkan jumlah pembayaran"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            v-model="jumlahPembayaran"
            required
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-1 border-[#D9D9D9] my-0.5 pl-2"
          >
            <select
              v-model="satuanJumlahPembayaran"
              class="text-center text-sm sm:text-md px-1 sm:px-2.5 appearance-none [&::-ms-expand]:hidden [&_::-webkit-select-placeholder]:hidden"
            >
              <option value="KG">KG</option>
              <option value="PCS">PCS</option>
              <option value="LITER">LITER</option>
            </select>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0">
        <label for="jumlah-spp" class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >Jumlah SPP <span class="text-red-500">*</span></label
        >
        <input
          type="number"
          id="jumlah-spp"
          placeholder="Masukkan jumlah SPP"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          v-model="jumlahSPP"
          required
        />
      </div>
    </div>
  </section>
</template>
