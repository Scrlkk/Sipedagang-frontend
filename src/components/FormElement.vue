<script setup>
  import {
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    computed,
  } from 'vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import api from '@/services/authService' // Import untuk API call

  const props = defineProps({
    isEditMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['form-changed'])

  // ✅ Simplified data pemohon - hanya yang diperlukan
  const namaSupplier = ref('')
  const namaPerusahaan = ref('')
  const jenisBank = ref('')
  const nomorRekening = ref('')
  const atasnamaRekening = ref('')
  const nomorPO = ref('')
  const tanggalPengadaan = ref('')
  const jenisPengadaan = ref('')
  const kuantum = ref('')
  const satuanKuantum = ref('KG')
  const satuanJumlahPembayaran = ref('KG')
  const jumlahSPP = ref('')
  const satuanJumlahSPP = ref('KG')

  // ✅ State untuk autocomplete perusahaan
  const searchCompany = ref('')
  const companyResults = ref([])
  const showDropdown = ref(false)
  const isSearching = ref(false)
  const selectedCompany = ref(null)
  const searchTimeout = ref(null)

  // ✅ NEW: State untuk autocomplete jenis pengadaan
  const searchJenisPengadaan = ref('')
  const jenisPengadaanResults = ref([])
  const showJenisPengadaanDropdown = ref(false)
  const isSearchingJenisPengadaan = ref(false)
  const selectedJenisPengadaan = ref(null)
  const searchJenisPengadaanTimeout = ref(null)

  const pengadaanStore = usePengadaanStore()
  const hasChanges = ref(false)
  const initialFormData = ref({})

  // ✅ DATA IN
  const dataInList = ref([{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }])

  // ✅ Computed property untuk Jumlah Pembayaran
  const jumlahPembayaran = computed(() => {
    const total = dataInList.value.reduce((sum, row) => {
      const jumlah = parseFloat(row.jumlah) || 0
      return sum + jumlah
    }, 0)
    return total > 0 ? total.toString() : ''
  })

  // ✅ Function untuk search perusahaan
  const searchPerusahaan = async (query) => {
    if (!query || query.trim().length < 2) {
      companyResults.value = []
      showDropdown.value = false
      return
    }

    isSearching.value = true
    try {
      const response = await api.get('/data-pemohon/by-perusahaan', {
        params: {
          nama_perusahaan: query.trim(),
        },
      })

      companyResults.value = response.data || []
      showDropdown.value = companyResults.value.length > 0
    } catch (error) {
      console.error('Error searching company:', error)
      companyResults.value = []
      showDropdown.value = false
    } finally {
      isSearching.value = false
    }
  }

  // ✅ MODIFIED: Function untuk search jenis pengadaan - RETURN FULL DATA
  const searchJenisPengadaanData = async (query) => {
    if (!query || query.trim().length < 1) {
      jenisPengadaanResults.value = []
      showJenisPengadaanDropdown.value = false
      return
    }

    isSearchingJenisPengadaan.value = true
    try {
      const response = await api.get('/pengaturan-pengadaan')

      // Filter data berdasarkan query
      const allData = response.data?.data || response.data || []
      const filteredData = allData.filter(
        (item) =>
          item.jenis_pengadaan_barang &&
          item.jenis_pengadaan_barang
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      )

      // ✅ NEW: Group by jenis_pengadaan_barang dan ambil data lengkap
      const groupedData = {}
      filteredData.forEach((item) => {
        const jenis = item.jenis_pengadaan_barang
        if (!groupedData[jenis]) {
          groupedData[jenis] = {
            jenis_pengadaan_barang: jenis,
            satuan: item.satuan || 'KG', // Ambil satuan dari data
            // Bisa tambah field lain jika diperlukan
            pph: item.pph,
            ppn: item.ppn,
            fullData: item, // Simpan data lengkap untuk referensi
          }
        }
      })

      jenisPengadaanResults.value = Object.values(groupedData)
      showJenisPengadaanDropdown.value = jenisPengadaanResults.value.length > 0
    } catch (error) {
      console.error('Error searching jenis pengadaan:', error)
      jenisPengadaanResults.value = []
      showJenisPengadaanDropdown.value = false
    } finally {
      isSearchingJenisPengadaan.value = false
    }
  }

  // ✅ Handle input search perusahaan dengan debounce
  const handleSearchInput = (event) => {
    const query = event.target.value
    searchCompany.value = query

    // Clear previous timeout
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    // Reset data jika query kosong
    if (!query || query.trim() === '') {
      clearPemohonData()
      companyResults.value = []
      showDropdown.value = false
      return
    }

    // Clear selection if user types something different
    if (
      selectedCompany.value &&
      query !== selectedCompany.value.nama_perusahaan
    ) {
      selectedCompany.value = null
      clearPemohonData()
    }

    // Show dropdown for feedback
    if (query.length >= 2) {
      // Debounce search
      searchTimeout.value = setTimeout(() => {
        searchPerusahaan(query)
      }, 300)
    } else {
      showDropdown.value = true // Show hint text
    }
  }

  // ✅ NEW: Handle input search jenis pengadaan dengan debounce
  const handleJenisPengadaanSearchInput = (event) => {
    const query = event.target.value
    searchJenisPengadaan.value = query
    jenisPengadaan.value = query // Update jenisPengadaan secara real-time

    // Clear previous timeout
    if (searchJenisPengadaanTimeout.value) {
      clearTimeout(searchJenisPengadaanTimeout.value)
    }

    // Reset selection jika query kosong
    if (!query || query.trim() === '') {
      selectedJenisPengadaan.value = null
      jenisPengadaanResults.value = []
      showJenisPengadaanDropdown.value = false
      return
    }

    // Clear selection if user types something different
    if (
      selectedJenisPengadaan.value &&
      query !== selectedJenisPengadaan.value.jenis_pengadaan_barang
    ) {
      selectedJenisPengadaan.value = null
    }

    // Debounce search
    searchJenisPengadaanTimeout.value = setTimeout(() => {
      searchJenisPengadaanData(query)
    }, 200)
  }

  // ✅ Handle focus perusahaan
  const handleFocus = () => {
    if (companyResults.value.length > 0 && !selectedCompany.value) {
      showDropdown.value = true
    }
  }

  // ✅ NEW: Handle focus jenis pengadaan
  const handleJenisPengadaanFocus = () => {
    if (
      jenisPengadaanResults.value.length > 0 &&
      !selectedJenisPengadaan.value
    ) {
      showJenisPengadaanDropdown.value = true
    }

    // Jika field kosong, langsung search untuk menampilkan semua
    if (
      !searchJenisPengadaan.value ||
      searchJenisPengadaan.value.trim() === ''
    ) {
      searchJenisPengadaanData('') // Search dengan query kosong untuk menampilkan semua
    }
  }

  // ✅ Handle blur perusahaan
  const handleBlur = () => {
    setTimeout(() => {
      showDropdown.value = false
    }, 150)
  }

  // ✅ NEW: Handle blur jenis pengadaan
  const handleJenisPengadaanBlur = () => {
    setTimeout(() => {
      showJenisPengadaanDropdown.value = false
    }, 150)
  }

  // ✅ Handle pemilihan perusahaan
  const selectCompany = (company) => {
    selectedCompany.value = company
    searchCompany.value = company.nama_perusahaan

    // ✅ Auto-fill semua field
    namaSupplier.value = company.nama_suplier || ''
    namaPerusahaan.value = company.nama_perusahaan || ''
    jenisBank.value = company.jenis_bank || ''
    nomorRekening.value = company.no_rekening || ''
    atasnamaRekening.value = company.atasnama_rekening || ''

    showDropdown.value = false
    companyResults.value = []

    // Trigger change detection
    nextTick(() => {
      checkForChanges()
    })
  }

  // ✅ MODIFIED: Handle pemilihan jenis pengadaan - UPDATE SEMUA SATUAN
  const selectJenisPengadaan = (jenisPengadaanObj) => {
    selectedJenisPengadaan.value = jenisPengadaanObj
    searchJenisPengadaan.value = jenisPengadaanObj.jenis_pengadaan_barang
    jenisPengadaan.value = jenisPengadaanObj.jenis_pengadaan_barang

    // ✅ NEW: Update semua satuan berdasarkan jenis pengadaan
    const newSatuan = jenisPengadaanObj.satuan || 'KG'
    updateAllSatuan(newSatuan)

    showJenisPengadaanDropdown.value = false
    jenisPengadaanResults.value = []

    // Trigger change detection
    nextTick(() => {
      checkForChanges()
    })
  }

  // ✅ NEW: Function untuk update semua satuan
  const updateAllSatuan = (newSatuan) => {
    console.log('Updating all satuan to:', newSatuan)

    // Update semua ref satuan
    satuanKuantum.value = newSatuan
    satuanJumlahPembayaran.value = newSatuan
    satuanJumlahSPP.value = newSatuan

    // Update satuan di semua data IN
    dataInList.value.forEach((row) => {
      row.satuan = newSatuan
    })
  }

  // ✅ Clear data pemohon
  const clearPemohonData = () => {
    namaSupplier.value = ''
    namaPerusahaan.value = ''
    jenisBank.value = ''
    nomorRekening.value = ''
    atasnamaRekening.value = ''
  }

  // ✅ NEW: Clear jenis pengadaan
  const clearJenisPengadaanData = () => {
    selectedJenisPengadaan.value = null
    searchJenisPengadaan.value = ''
    jenisPengadaan.value = ''

    // ✅ Reset satuan ke default jika tidak ada jenis pengadaan
    updateAllSatuan('KG')
  }

  // ✅ Clear selection perusahaan
  const clearSelection = () => {
    selectedCompany.value = null
    searchCompany.value = ''
    clearPemohonData()
    showDropdown.value = false
    companyResults.value = []

    nextTick(() => {
      checkForChanges()
    })
  }

  // ✅ NEW: Clear selection jenis pengadaan
  const clearJenisPengadaanSelection = () => {
    clearJenisPengadaanData()
    showJenisPengadaanDropdown.value = false
    jenisPengadaanResults.value = []

    nextTick(() => {
      checkForChanges()
    })
  }

  // ✅ Handle click outside untuk close dropdown
  const handleClickOutside = (event) => {
    const dropdown = event.target.closest('.company-search-container')
    const jenisPengadaanDropdown = event.target.closest(
      '.jenis-pengadaan-search-container',
    )

    if (!dropdown) {
      showDropdown.value = false
    }

    if (!jenisPengadaanDropdown) {
      showJenisPengadaanDropdown.value = false
    }
  }

  const saveInitialData = () => {
    initialFormData.value = {
      searchCompany: searchCompany.value,
      namaSupplier: namaSupplier.value,
      namaPerusahaan: namaPerusahaan.value,
      jenisBank: jenisBank.value,
      nomorRekening: nomorRekening.value,
      atasnamaRekening: atasnamaRekening.value,
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
      searchCompany: searchCompany.value,
      namaSupplier: namaSupplier.value,
      namaPerusahaan: namaPerusahaan.value,
      jenisBank: jenisBank.value,
      nomorRekening: nomorRekening.value,
      atasnamaRekening: atasnamaRekening.value,
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

  // ✅ MISSING: Add getFormData function
  const getFormData = () => {
    const formattedDataIn = dataInList.value.map((row) => ({
      no_in: row.no_in,
      tanggal_in: row.tanggal,
      kuantum_in: row.jumlah ? `${row.jumlah} ${row.satuan}` : '',
    }))

    const kuantumFormatted = kuantum.value
      ? `${kuantum.value} ${satuanKuantum.value}`
      : ''
    const sppFormatted = jumlahSPP.value
      ? `${jumlahSPP.value} ${satuanJumlahSPP.value}`
      : ''
    const jumlahPembayaranFormatted = jumlahPembayaran.value
      ? `${jumlahPembayaran.value} ${satuanJumlahPembayaran.value}`
      : ''

    return {
      // Data Pemohon
      nama_suplier: namaSupplier.value,
      nama_perusahaan: namaPerusahaan.value,
      jenis_bank: jenisBank.value,
      no_rekening: nomorRekening.value,
      atasnama_rekening: atasnamaRekening.value,

      // Detail PO
      no_preorder: nomorPO.value,
      tanggal_pengadaan: tanggalPengadaan.value,
      jenis_pengadaan_barang: jenisPengadaan.value,
      kuantum: kuantumFormatted,
      satuan: satuanKuantum.value,

      // Data IN
      in_data: formattedDataIn,

      // Pembayaran
      jumlah_pembayaran: jumlahPembayaranFormatted,
      spp: sppFormatted,
    }
  }

  // ✅ MISSING: Add other required functions
  const clearFormWithDelay = async (delay = 100) => {
    await new Promise((resolve) => setTimeout(resolve, delay))
    clearForm()
  }

  const validateForm = () => {
    const errors = []

    // Validasi Data Pemohon
    if (!namaSupplier.value) errors.push('Nama Supplier harus diisi')
    if (!namaPerusahaan.value) errors.push('Nama Perusahaan harus diisi')
    if (!jenisBank.value) errors.push('Jenis Bank harus diisi')
    if (!nomorRekening.value) errors.push('Nomor Rekening harus diisi')
    if (!atasnamaRekening.value) errors.push('Atas Nama Rekening harus diisi')

    // Validasi Detail PO
    if (!nomorPO.value) errors.push('Nomor PO harus diisi')
    if (!tanggalPengadaan.value) errors.push('Tanggal Pengadaan harus diisi')
    if (!jenisPengadaan.value) errors.push('Jenis Pengadaan harus diisi')
    if (!kuantum.value) errors.push('Kuantum harus diisi')

    // Validasi Data IN
    const hasValidDataIn = dataInList.value.some(
      (row) => row.no_in && row.tanggal && row.jumlah,
    )
    if (!hasValidDataIn) errors.push('Minimal satu Data IN harus diisi lengkap')

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const submitForm = async () => {
    const validation = validateForm()
    if (!validation.isValid) {
      throw new Error(`Validasi gagal: ${validation.errors.join(', ')}`)
    }

    const formData = getFormData()

    try {
      if (props.isEditMode) {
        return await pengadaanStore.updatePengadaan(formData.id, formData)
      } else {
        return await pengadaanStore.createPengadaan(formData)
      }
    } catch (error) {
      console.error('Submit form error:', error)
      throw error
    }
  }

  const updateForm = async (id, data) => {
    try {
      return await pengadaanStore.updatePengadaan(id, data)
    } catch (error) {
      console.error('Update form error:', error)
      throw error
    }
  }

  // ✅ MISSING: Add removeDataInRow function
  const removeDataInRow = (index) => {
    if (dataInList.value.length > 1) {
      dataInList.value.splice(index, 1)
    }
  }

  // ✅ MISSING: Add handleNomorPOInput, handleNomorPOPaste, handleNomorPOKeypress functions
  const handleNomorPOInput = (event) => {
    let value = event.target.value.replace(/[^A-Za-z0-9]/g, '')

    // Auto format: XXXX/XX/XXXXX/XXXX
    if (value.length <= 4) {
      nomorPO.value = value
    } else if (value.length <= 6) {
      nomorPO.value = `${value.slice(0, 4)}/${value.slice(4)}`
    } else if (value.length <= 11) {
      nomorPO.value = `${value.slice(0, 4)}/${value.slice(4, 6)}/${value.slice(6)}`
    } else if (value.length <= 15) {
      nomorPO.value = `${value.slice(0, 4)}/${value.slice(4, 6)}/${value.slice(6, 11)}/${value.slice(11)}`
    }
  }

  const handleNomorPOPaste = (event) => {
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData(
      'text',
    )
    const cleanText = pastedText.replace(/[^A-Za-z0-9]/g, '')

    if (cleanText.length <= 15) {
      const input = event.target
      input.value = cleanText
      handleNomorPOInput({ target: input })
    }
  }

  const handleNomorPOKeypress = (event) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
    ]
    if (allowedKeys.includes(event.key)) return

    if (!/[A-Za-z0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  function clearForm() {
    // ✅ Clear search dan data pemohon
    searchCompany.value = ''
    selectedCompany.value = null
    clearPemohonData()

    // ✅ Clear jenis pengadaan
    clearJenisPengadaanData()

    nomorPO.value = ''
    tanggalPengadaan.value = ''
    kuantum.value = ''
    jumlahSPP.value = ''
    dataInList.value = [{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }]

    // Clear store messages
    if (pengadaanStore && pengadaanStore.clearMessages) {
      pengadaanStore.clearMessages()
    }

    // Clear dropdown
    companyResults.value = []
    showDropdown.value = false
    jenisPengadaanResults.value = []
    showJenisPengadaanDropdown.value = false

    // ✅ Use nextTick to ensure all reactivity updates are complete
    return nextTick(() => {
      saveInitialData()
    })
  }

  // ✅ FIXED: Force clear method untuk memastikan reset total
  const forceClearForm = async () => {
    console.log('Force clearing form...')

    // Clear all form values step by step
    searchCompany.value = ''
    selectedCompany.value = null
    namaSupplier.value = ''
    namaPerusahaan.value = ''
    jenisBank.value = ''
    nomorRekening.value = ''
    atasnamaRekening.value = ''
    searchJenisPengadaan.value = ''
    selectedJenisPengadaan.value = null
    jenisPengadaan.value = ''
    nomorPO.value = ''
    tanggalPengadaan.value = ''
    kuantum.value = ''
    jumlahSPP.value = ''
    satuanKuantum.value = 'KG'
    satuanJumlahPembayaran.value = 'KG'
    satuanJumlahSPP.value = 'KG'
    dataInList.value = [{ no_in: '', tanggal: '', jumlah: '', satuan: 'KG' }]
    companyResults.value = []
    showDropdown.value = false
    jenisPengadaanResults.value = []
    showJenisPengadaanDropdown.value = false
    isSearching.value = false
    isSearchingJenisPengadaan.value = false

    // Clear timeouts
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }

    if (searchJenisPengadaanTimeout.value) {
      clearTimeout(searchJenisPengadaanTimeout.value)
      searchJenisPengadaanTimeout.value = null
    }

    // Clear store
    if (pengadaanStore && pengadaanStore.clearMessages) {
      pengadaanStore.clearMessages()
    }

    await nextTick()
    saveInitialData()

    console.log('Force clear completed')
  }

  // ✅ Move addDataInRow function BEFORE defineExpose
  const addDataInRow = () => {
    dataInList.value.push({
      no_in: '',
      tanggal: '',
      jumlah: '',
      satuan: satuanKuantum.value || 'KG',
    })
  }

  // ✅ NEW: populateForm — fill all refs from an incoming object
  const populateForm = (formData) => {
    // — Pemohon —
    searchCompany.value = formData.nama_perusahaan || ''
    selectedCompany.value = {
      nama_perusahaan: formData.nama_perusahaan,
      nama_suplier: formData.nama_suplier,
      jenis_bank: formData.jenis_bank,
      no_rekening: formData.no_rekening,
      atasnama_rekening: formData.atasnama_rekening,
    }
    namaSupplier.value = formData.nama_suplier || ''
    namaPerusahaan.value = formData.nama_perusahaan || ''
    jenisBank.value = formData.jenis_bank || ''
    nomorRekening.value = formData.no_rekening || ''
    atasnamaRekening.value = formData.atasnama_rekening || ''

    // — PO Detail —
    nomorPO.value = formData.no_preorder || ''
    tanggalPengadaan.value = formData.tanggal_pengadaan || ''
    jenisPengadaan.value = formData.jenis_pengadaan_barang || ''
    searchJenisPengadaan.value = jenisPengadaan.value
    selectedJenisPengadaan.value = {
      jenis_pengadaan_barang: jenisPengadaan.value,
      satuan: formData.satuan || 'KG',
      fullData: formData,
    }
    kuantum.value = formData.kuantum ? formData.kuantum.split(' ')[0] : ''
    satuanKuantum.value = formData.satuan || 'KG'
    updateAllSatuan(satuanKuantum.value)

    // — Data IN —
    dataInList.value = (formData.in_data || []).map((item) => {
      const [j, u] = (item.kuantum_in || '').split(' ')
      return {
        no_in: item.no_in || '',
        tanggal: item.tanggal_in || '',
        jumlah: j || '',
        satuan: u || satuanKuantum.value,
      }
    })

    // — Pembayaran/SPP —
    const [jp, up] = (formData.jumlah_pembayaran || '').split(' ')
    const [sppV, sppU] = (formData.spp || '').split(' ')
    satuanJumlahPembayaran.value = up || satuanKuantum.value
    jumlahSPP.value = sppV || ''
    satuanJumlahSPP.value = sppU || satuanKuantum.value

    // mark this as the new "initial" state
    nextTick(() => saveInitialData())
  }

  // ✅ Expose the force clear method - AFTER all functions are declared
  defineExpose({
    clearForm,
    forceClearForm,
    populateForm,
    getFormData,
    clearFormWithDelay,
    validateForm,
    submitForm,
    updateForm,
    pengadaanStore,
    hasChanges,
    saveInitialData,
    addDataInRow,
  })

  // ✅ ADD: Watch for form changes
  watch(
    [
      searchCompany,
      namaSupplier,
      namaPerusahaan,
      jenisBank,
      nomorRekening,
      atasnamaRekening,
      nomorPO,
      tanggalPengadaan,
      jenisPengadaan,
      kuantum,
      jumlahSPP,
      dataInList,
    ],
    () => {
      checkForChanges()
    },
    { deep: true },
  )

  onMounted(() => {
    if (!props.isEditMode) {
      nextTick(() => {
        saveInitialData()
      })
    }

    // ✅ Add click outside listener
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    if (searchJenisPengadaanTimeout.value) {
      clearTimeout(searchJenisPengadaanTimeout.value)
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
      <!-- ✅ Search Nama Perusahaan -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="search-company"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Nama Perusahaan <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full company-search-container">
          <input
            type="text"
            id="search-company"
            placeholder="Ketik nama perusahaan untuk mencari..."
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
            v-model="searchCompany"
            @input="handleSearchInput"
            @focus="handleFocus"
            @blur="handleBlur"
            required
          />

          <!-- Search/Loading icon -->
          <div
            v-if="!selectedCompany"
            class="absolute inset-y-0 right-7.5 flex items-center pointer-events-none"
          >
            <svg
              v-if="!isSearching"
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <svg
              v-else
              class="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 118-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <!-- Clear button -->
          <button
            v-if="selectedCompany"
            type="button"
            @click="clearSelection"
            class="absolute inset-y-0 right-7.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Dropdown Results -->
          <div
            v-if="showDropdown && companyResults.length > 0"
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="(company, index) in companyResults"
              :key="index"
              @mousedown="selectCompany(company)"
              class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div class="font-medium text-sm text-gray-900">
                {{ company.nama_perusahaan }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ company.nama_suplier }} • {{ company.jenis_bank }}
              </div>
            </div>
          </div>

          <!-- No results -->
          <div
            v-if="
              showDropdown &&
              companyResults.length === 0 &&
              searchCompany.length >= 2 &&
              !isSearching &&
              !selectedCompany
            "
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm"
          >
            Tidak ada perusahaan ditemukan untuk "{{ searchCompany }}"
          </div>

          <!-- Hint text -->
          <div
            v-if="
              showDropdown &&
              searchCompany.length > 0 &&
              searchCompany.length < 2 &&
              !selectedCompany
            "
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm"
          >
            Ketik minimal 2 karakter untuk mencari...
          </div>
        </div>
      </div>

      <!-- ✅ Fields yang muncul setelah memilih perusahaan -->
      <template v-if="selectedCompany">
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
            class="border-[2.2px] border-green-200 bg-green-50 rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base cursor-not-allowed text-green-700 font-medium"
            v-model="namaSupplier"
            readonly
            disabled
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
          <input
            type="text"
            id="jenis-bank"
            class="border-[2.2px] border-green-200 bg-green-50 rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base cursor-not-allowed text-green-700 font-medium"
            v-model="jenisBank"
            readonly
            disabled
            required
          />
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
            class="border-[2.2px] border-green-200 bg-green-50 rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base cursor-not-allowed text-green-700 font-medium font-mono"
            v-model="nomorRekening"
            readonly
            disabled
            required
          />
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
        >
          <label
            for="atasnama-rekening"
            class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
          >
            Atas Nama Rekening <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="atasnama-rekening"
            class="border-[2.2px] border-green-200 bg-green-50 rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base cursor-not-allowed text-green-700 font-medium"
            v-model="atasnamaRekening"
            readonly
            disabled
            required
          />
        </div>

        <div
          class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="font-medium"
              >Data pemohon berhasil diisi otomatis</span
            >
          </div>
          <div class="mt-1 text-xs">
            Data supplier, bank, dan rekening telah diambil dari database
            berdasarkan perusahaan yang dipilih.
          </div>
        </div>
      </template>

      <!-- ✅ Pesan instruksi jika belum ada yang dipilih -->
      <div
        v-else-if="!selectedCompany && searchCompany.length === 0"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500"
      >
        <div class="flex items-center justify-center gap-2 mb-2">
          <svg
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span class="font-medium">Mulai dengan mencari perusahaan</span>
        </div>
        <p>
          Ketik nama perusahaan di kolom pencarian untuk menampilkan dan mengisi
          data pemohon secara otomatis.
        </p>
      </div>
    </div>

    <!-- DETAIL PURCHASING ORDER -->
    <div class="font-bold text-lg sm:text-xl mt-4">Detail Purchasing Order</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <!-- ✅ Nomor PO dengan Auto-formatting -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="nomor-po"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Nomor PO <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="nomor-po"
            placeholder="Otomatis Terformat: XXXX/XX/XXXXX/XXXX"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
            v-model="nomorPO"
            @input="handleNomorPOInput"
            @paste="handleNomorPOPaste"
            @keypress="handleNomorPOKeypress"
            maxlength="18"
            autocomplete="off"
            pattern="[A-Za-z0-9]{4}\/[A-Za-z0-9]{2}\/[A-Za-z0-9]{5}\/[A-Za-z0-9]{4}"
            title="Format: 4 karakter/2 karakter/5 karakter/4 karakter"
            required
          />

          <!-- Info icon dengan tooltip -->
          <div
            class="absolute inset-y-0 right-7.5 flex items-center pointer-events-none"
            title="Format otomatis: XXXX/XX/XXXXX/XXXX"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="tanggal-pengadaan"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Tanggal Pengadaan <span class="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="tanggal-pengadaan"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="tanggalPengadaan"
          required
        />
      </div>

      <!-- ✅ Search Jenis Pengadaan dengan Autocomplete -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="search-jenis-pengadaan"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Jenis Pengadaan <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full jenis-pengadaan-search-container">
          <input
            type="text"
            id="search-jenis-pengadaan"
            placeholder="Ketik atau pilih jenis pengadaan..."
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
            v-model="searchJenisPengadaan"
            @input="handleJenisPengadaanSearchInput"
            @focus="handleJenisPengadaanFocus"
            @blur="handleJenisPengadaanBlur"
            required
          />

          <!-- Search/Loading icon -->
          <div
            v-if="!selectedJenisPengadaan"
            class="absolute inset-y-0 right-7.5 flex items-center pointer-events-none"
          >
            <svg
              v-if="!isSearchingJenisPengadaan"
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <svg
              v-else
              class="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 118-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <!-- Clear button -->
          <button
            v-if="selectedJenisPengadaan || searchJenisPengadaan"
            type="button"
            @click="clearJenisPengadaanSelection"
            class="absolute inset-y-0 right-7.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Dropdown Results -->
          <div
            v-if="
              showJenisPengadaanDropdown && jenisPengadaanResults.length > 0
            "
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="(jenisObj, index) in jenisPengadaanResults"
              :key="index"
              @mousedown="selectJenisPengadaan(jenisObj)"
              class="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div class="font-medium text-sm text-gray-900 flex items-center">
                <svg
                  class="w-4 h-4 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                {{ jenisObj.jenis_pengadaan_barang }}
                <!-- ✅ Tampilkan satuan di dropdown -->
                <span
                  class="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ jenisObj.satuan }}
                </span>
              </div>
            </div>
          </div>

          <!-- No results -->
          <div
            v-if="
              showJenisPengadaanDropdown &&
              jenisPengadaanResults.length === 0 &&
              searchJenisPengadaan.length >= 1 &&
              !isSearchingJenisPengadaan &&
              !selectedJenisPengadaan
            "
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm"
          >
            Tidak ada jenis pengadaan ditemukan untuk "{{
              searchJenisPengadaan
            }}"
          </div>
        </div>
      </div>

      <!-- ✅ Info satuan jika ada jenis pengadaan terpilih -->
      <div
        v-if="selectedJenisPengadaan"
        class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">
            Satuan otomatis diatur ke: {{ selectedJenisPengadaan.satuan }}
          </span>
        </div>
        <div class="mt-1 text-xs">
          Semua satuan dalam form ini akan mengikuti satuan dari jenis pengadaan
          yang dipilih.
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="kuantum"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Kuantum <span class="text-red-500">*</span>
        </label>
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
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-[1px] border-[#D9D9D9] my-0.5 pl-2"
          >
            <!-- ✅ Satuan readonly, mengikuti jenis pengadaan -->
            <span
              class="text-center text-sm sm:text-base px-1 sm:px-2.5 py-1 min-w-[60px] font-medium"
              :class="
                selectedJenisPengadaan ? 'text-green-600' : 'text-gray-500'
              "
            >
              {{ satuanKuantum }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- DATA IN -->
    <div class="font-bold text-lg sm:text-xl mt-4 flex gap-x-2 items-center">
      <div>
        Data IN <span class="text-red-500 text-base sm:text-base">*</span>
      </div>
    </div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div
        v-for="(row, idx) in dataInList"
        :key="idx"
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-x-3"
      >
        <!-- Nomor IN manual -->
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
          required
        />
        <div class="relative w-full">
          <input
            type="number"
            v-model="row.jumlah"
            placeholder="Masukkan jumlah"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-[1px] border-[#D9D9D9] my-0.5 pl-2"
          >
            <!-- ✅ Satuan readonly, mengikuti jenis pengadaan -->
            <span
              class="text-center text-sm sm:text-base px-1 sm:px-2.5 py-1 cursor-not-allowed min-w-[60px] bg-gray-50 rounded font-medium"
              :class="
                selectedJenisPengadaan ? 'text-green-600' : 'text-gray-500'
              "
            >
              {{ satuanKuantum }}
            </span>
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
          class="mt-2 px-3 sm:px-4 py-2 hover:bg-green-500 text-white rounded bg-green-600 transition-all duration-200 ease-in-out w-fit text-sm sm:text-base"
          @click="addDataInRow"
        >
          + Tambah Data IN
        </button>
      </div>

      <div
        v-if="dataInList.length >= 2"
        class="text-gray-500 text-center text-sm"
      >
        Total {{ dataInList.length }} baris Data IN
      </div>
    </div>

    <!-- ✅ INFORMASI PEMBAYARAN - TETAP ADA -->
    <div class="font-bold text-lg sm:text-xl mt-4">Informasi Pembayaran</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <!-- ✅ JUMLAH PEMBAYARAN - TETAP ADA -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="jumlah-pembayaran"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Jumlah Pembayaran
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="jumlah-pembayaran"
            :value="jumlahPembayaran"
            readonly
            class="border-[2.2px] border-[#E5E5E5] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base bg-gray-50 cursor-not-allowed"
            placeholder="Akan otomatis terhitung dari Data IN"
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-[1px] border-[#E5E5E5] my-0.5 pl-2"
          >
            <!-- ✅ Satuan readonly, mengikuti jenis pengadaan -->
            <span
              class="text-center text-sm sm:text-base px-1 sm:px-2.5 py-1 min-w-[60px] font-medium"
              :class="
                selectedJenisPengadaan ? 'text-green-600' : 'text-gray-500'
              "
            >
              {{ satuanJumlahPembayaran }}
            </span>
          </div>
        </div>
      </div>

      <!-- ✅ JUMLAH SPP - TETAP ADA -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="jumlah-spp"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Jumlah SPP
          <span class="text-xs sm:text-sm font-normal text-gray-500"
            >(Opsional)</span
          >
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="jumlah-spp"
            placeholder="Masukkan jumlah SPP (opsional)"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
            v-model="jumlahSPP"
          />
          <div
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 border-l-[1px] border-[#D9D9D9] my-0.5 pl-2"
          >
            <!-- ✅ Satuan readonly, mengikuti jenis pengadaan -->
            <span
              class="text-center text-sm sm:text-base px-1 sm:px-2.5 py-1 min-w-[60px] font-medium"
              :class="
                selectedJenisPengadaan ? 'text-green-600' : 'text-gray-500'
              "
            >
              {{ satuanJumlahSPP }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
