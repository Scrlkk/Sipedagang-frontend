<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { useSettingPengadaanStore } from '@/stores/settingPengadaanStore'

  const props = defineProps({
    isEditMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['form-changed'])

  const jenisPengadaanBarang = ref('')
  const satuan = ref('')
  const hargaPerSatuan = ref('')
  const ppn = ref('0') // ✅ Set default value to "0"
  const pph = ref('0') // ✅ Set default value to "0"

  // ✅ FIX: Use setting pengadaan store
  const settingPengadaanStore = useSettingPengadaanStore()

  const hasChanges = ref(false)
  const initialFormData = ref({})

  const saveInitialData = () => {
    initialFormData.value = {
      jenisPengadaanBarang: jenisPengadaanBarang.value,
      satuan: satuan.value,
      hargaPerSatuan: hargaPerSatuan.value,
      ppn: ppn.value,
      pph: pph.value,
    }
    hasChanges.value = false
    emit('form-changed', false)
  }

  const checkForChanges = () => {
    const currentData = {
      jenisPengadaanBarang: jenisPengadaanBarang.value,
      satuan: satuan.value,
      hargaPerSatuan: hargaPerSatuan.value,
      ppn: ppn.value,
      pph: pph.value,
    }

    const hasFormChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialFormData.value)
    hasChanges.value = hasFormChanges
    emit('form-changed', hasFormChanges)
  }

  function clearForm() {
    jenisPengadaanBarang.value = ''
    satuan.value = ''
    hargaPerSatuan.value = ''
    ppn.value = '0' // ✅ Reset to default "0"
    pph.value = '0' // ✅ Reset to default "0"
    settingPengadaanStore.clearCurrentPengaturanPengadaan()

    nextTick(() => {
      saveInitialData()
    })
  }

  // ✅ UPDATED: Enhanced populateForm function
  function populateForm(data) {
    if (!data) {
      console.warn('No data provided to populateForm')
      return
    }

    console.log('Populating form with data:', data)

    jenisPengadaanBarang.value = data.jenis_pengadaan_barang || ''
    satuan.value = data.satuan || ''
    // Format price for display when populating form
    hargaPerSatuan.value = data.harga_per_satuan
      ? formatCurrency(data.harga_per_satuan)
      : ''
    ppn.value =
      data.ppn !== undefined && data.ppn !== null ? data.ppn.toString() : '0' // ✅ Default to "0" if no value
    pph.value =
      data.pph !== undefined && data.pph !== null ? data.pph.toString() : '0' // ✅ Default to "0" if no value

    nextTick(() => {
      saveInitialData()
      console.log('Form populated and initial data saved')
    })
  }

  function clearFormWithDelay(delay = 1000) {
    setTimeout(() => {
      clearForm()
    }, delay)
  }

  // ✅ UPDATED: Convert satuan to uppercase before sending to database
  function getFormData() {
    const formData = {
      jenis_pengadaan_barang: jenisPengadaanBarang.value,
      satuan: satuan.value.toUpperCase(), // ✅ Convert to uppercase
      harga_per_satuan:
        parseFloat(hargaPerSatuan.value.replace(/[^0-9]/g, '')) || 0,
      ppn: parseFloat(ppn.value) || 0,
      pph: parseFloat(pph.value) || 0,
    }

    return formData
  }

  function validateForm() {
    const errors = []

    if (!jenisPengadaanBarang.value)
      errors.push('Jenis Pengadaan Barang harus diisi')
    if (!satuan.value) errors.push('Satuan harus diisi')
    if (!hargaPerSatuan.value) errors.push('Harga Per Satuan harus diisi')
    // ✅ Remove validation for ppn and pph since they have default values
    // if (!ppn.value) errors.push('PPN harus diisi')
    // if (!pph.value) errors.push('PPh harus diisi')

    // Validate numeric values
    const priceValue = parseFloat(hargaPerSatuan.value.replace(/[^0-9]/g, ''))
    if (hargaPerSatuan.value && isNaN(priceValue)) {
      errors.push('Harga Per Satuan harus berupa angka')
    }
    if (ppn.value && isNaN(parseFloat(ppn.value))) {
      errors.push('PPN harus berupa angka')
    }
    if (pph.value && isNaN(parseFloat(pph.value))) {
      errors.push('PPh harus berupa angka')
    }

    return errors
  }

  async function submitForm() {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    const formData = getFormData()
    const result =
      await settingPengadaanStore.createPengaturanPengadaan(formData)

    if (result) {
      clearFormWithDelay(1000)
    }

    return result
  }

  // ✅ UPDATED: Enhanced updateForm function
  async function updateForm(id) {
    if (!id) {
      throw new Error('ID pengaturan pengadaan tidak valid')
    }

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    const formData = getFormData()
    console.log('Updating pengaturan pengadaan with ID:', id, 'Data:', formData)

    const result = await settingPengadaanStore.updatePengaturanPengadaan(
      id,
      formData,
    )

    if (result) {
      nextTick(() => {
        saveInitialData()
        console.log('Form updated and initial data refreshed')
      })
    }

    return result
  }

  // ✅ UPDATED: Currency formatting functions
  const formatCurrency = (value) => {
    if (!value) return ''
    const numericValue = value.toString().replace(/[^0-9]/g, '')
    if (!numericValue) return ''

    // Add thousand separators
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `Rp ${formatted}`
  }

  const handlePriceInput = (event) => {
    let value = event.target.value
    // Remove all non-numeric characters
    value = value.replace(/[^0-9]/g, '')

    if (value) {
      // Format with currency
      hargaPerSatuan.value = formatCurrency(value)
    } else {
      hargaPerSatuan.value = ''
    }
  }

  const handlePriceKeypress = (event) => {
    // Only allow numbers
    const char = String.fromCharCode(event.which)
    if (
      !/[0-9]/.test(char) &&
      ![8, 9, 37, 38, 39, 40, 46].includes(event.keyCode)
    ) {
      event.preventDefault()
    }
  }

  // ✅ UPDATED: Number input handlers for PPN and PPh (auto-clear "0" when typing)
  const handleNumberInput = (event, field) => {
    let value = event.target.value
    // Allow only numbers and decimal point (removed minus sign)
    value = value.replace(/[^0-9.]/g, '')

    // ✅ If value becomes empty, default to "0"
    if (value === '') {
      value = '0'
    }

    if (field === 'ppn') {
      ppn.value = value
    } else if (field === 'pph') {
      pph.value = value
    }
  }

  // ✅ NEW: Handle focus event to clear "0" when user starts typing
  const handleNumberFocus = (event, field) => {
    if (field === 'ppn' && ppn.value === '0') {
      ppn.value = ''
      // Clear the input field
      event.target.value = ''
    } else if (field === 'pph' && pph.value === '0') {
      pph.value = ''
      // Clear the input field
      event.target.value = ''
    }
  }

  const handleNumberKeypress = (event) => {
    const char = String.fromCharCode(event.which)
    // Allow: numbers (0-9), decimal point (.), backspace, delete, arrow keys, tab (removed minus sign)
    if (
      !/[0-9.]/.test(char) &&
      ![8, 9, 37, 38, 39, 40, 46].includes(event.keyCode)
    ) {
      event.preventDefault()
    }
  }

  // ✅ UPDATED: Handle number field blur to ensure default "0"
  const handleNumberBlur = (field) => {
    if (field === 'ppn' && (!ppn.value || ppn.value.trim() === '')) {
      ppn.value = '0'
    } else if (field === 'pph' && (!pph.value || pph.value.trim() === '')) {
      pph.value = '0'
    }
  }

  // ✅ NEW: Handle satuan input - convert to uppercase on blur for better UX
  const handleSatuanBlur = () => {
    if (satuan.value) {
      satuan.value = satuan.value.toUpperCase()
    }
  }

  defineExpose({
    clearForm,
    getFormData,
    clearFormWithDelay,
    validateForm,
    submitForm,
    updateForm,
    populateForm,
    settingPengadaanStore, // ✅ Expose the store reference
    hasChanges,
    saveInitialData,
  })

  // ✅ UPDATED: Watch with edit mode consideration
  watch(
    [jenisPengadaanBarang, satuan, hargaPerSatuan, ppn, pph],
    () => {
      // Only check for changes after form is properly initialized
      if (Object.keys(initialFormData.value).length > 0) {
        checkForChanges()
      }
    },
    { deep: true },
  )

  onMounted(() => {
    if (!props.isEditMode) {
      nextTick(() => {
        saveInitialData()
      })
    }
    // For edit mode, saveInitialData will be called from populateForm
  })
</script>

<template>
  <section
    class="flex flex-col gap-4 overflow-y-auto w-full h-full pb-3 px-2 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}]"
  >
    <!-- DATA PENGATURAN PENGADAAN -->
    <div class="font-bold text-lg sm:text-xl">Pengaturan Pengadaan</div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <!-- Jenis Pengadaan Barang -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="jenis-pengadaan-barang"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Pengadaan Barang <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="jenis-pengadaan-barang"
          placeholder="Masukkan jenis pengadaan barang"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base"
          v-model="jenisPengadaanBarang"
          required
        />
      </div>

      <!-- Satuan -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="satuan"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Satuan <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="satuan"
          placeholder="Masukkan satuan (contoh: PCS, KG, LITER)"
          class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base uppercase placeholder:normal-case"
          v-model="satuan"
          @blur="handleSatuanBlur"
          style="text-transform: uppercase"
          title="Satuan akan otomatis diubah ke huruf kapital"
          required
        />
      </div>

      <!-- Harga Per Satuan -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="harga-per-satuan"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          Harga Per Satuan <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="harga-per-satuan"
            placeholder="Rp 0"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base font-mono"
            v-model="hargaPerSatuan"
            @input="handlePriceInput"
            @keypress="handlePriceKeypress"
            autocomplete="off"
            inputmode="numeric"
            title="Masukkan harga dalam angka (contoh: 120000 akan menjadi Rp 120.000)"
            required
          />
        </div>
      </div>

      <!-- PPN -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="ppn"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          PPN (%) <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="ppn"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base font-mono"
            v-model="ppn"
            @focus="handleNumberFocus($event, 'ppn')"
            @input="handleNumberInput($event, 'ppn')"
            @keypress="handleNumberKeypress"
            @blur="handleNumberBlur('ppn')"
            autocomplete="off"
            inputmode="decimal"
            pattern="[0-9.]*"
            title="Masukkan persentase PPN (contoh: 12)"
            required
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <span class="text-gray-500 text-sm sm:text-base">%</span>
          </div>
        </div>
      </div>

      <!-- PPh -->
      <div
        class="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-0"
      >
        <label
          for="pph"
          class="min-w-0 sm:min-w-45 font-medium text-sm sm:text-base"
        >
          PPh (%) <span class="text-red-500">*</span>
        </label>
        <div class="relative w-full">
          <input
            type="text"
            id="pph"
            class="border-[2.2px] border-[#D9D9D9] rounded-lg h-10 sm:h-11.5 px-3 sm:px-7 w-full text-sm sm:text-base font-mono"
            v-model="pph"
            @focus="handleNumberFocus($event, 'pph')"
            @input="handleNumberInput($event, 'pph')"
            @keypress="handleNumberKeypress"
            @blur="handleNumberBlur('pph')"
            autocomplete="off"
            inputmode="decimal"
            pattern="[0-9.]*"
            title="Masukkan persentase PPh (contoh: 1.5)"
            required
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <span class="text-gray-500 text-sm sm:text-base">%</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
