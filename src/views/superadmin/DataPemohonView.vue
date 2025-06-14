<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import FormPemohon from '@/components/PemohonElement.vue'
  import PemohonIconElement from '@/components/PemohonIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import Swal from 'sweetalert2'

  const iconHover = ref(false)
  const formRef = ref(null)
  const isSubmitting = ref(false)
  const isUploadingCSV = ref(false)
  const router = useRouter()
  const hasUnsavedChanges = ref(false)

  const pengadaanStore = computed(() => formRef.value?.pengadaanStore)

  const confirmLeave = async () => {
    if (!hasUnsavedChanges.value) return true

    const result = await Swal.fire({
      title: 'Perubahan Belum Disimpan!',
      text: 'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Tinggalkan',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    return result.isConfirmed
  }

  onBeforeRouteLeave(async (to, from) => {
    const canLeave = await confirmLeave()
    if (!canLeave) {
      return false
    }
  })

  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault()
      event.returnValue =
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?'
      return event.returnValue
    }
  }

  // ✅ Handle event dari FormElement
  const handleFormChanged = (hasChanges) => {
    hasUnsavedChanges.value = hasChanges
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  // ✅ Clear dengan konfirmasi
  async function handleClear() {
    if (!hasUnsavedChanges.value) {
      if (formRef.value && formRef.value.clearForm) {
        formRef.value.clearForm()
      }
      return
    }

    const result = await Swal.fire({
      title: 'Konfirmasi Clear Form',
      text: 'Yakin ingin menghapus semua data yang sudah diisi?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      if (formRef.value && formRef.value.clearForm) {
        formRef.value.clearForm()
        hasUnsavedChanges.value = false
      }
    }
  }

  async function handleSubmit() {
    if (!formRef.value) return

    isSubmitting.value = true

    try {
      await formRef.value.submitForm()

      hasUnsavedChanges.value = false

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pengadaan berhasil disimpan',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      })
    } catch (error) {
      let errorTitle = 'Error!'
      let errorMsg = 'Terjadi kesalahan saat menyimpan data'
      let errorIcon = 'error'

      if (error.response) {
        const status = error.response.status
        const responseData = error.response.data

        switch (status) {
          case 422:
            errorTitle = 'Validasi Gagal!'
            if (responseData.errors) {
              const errorDetails = Object.entries(responseData.errors)
                .map(([field, messages]) => {
                  const fieldName = field
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                  return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
                })
                .join('\n')
              errorMsg = errorDetails
            } else if (responseData.message) {
              errorMsg = responseData.message
            }
            break

          case 409:
            errorTitle = 'Data Duplikat!'
            errorMsg =
              responseData.message ||
              'Data yang Anda masukkan sudah ada dalam sistem'
            errorIcon = 'warning'
            break

          case 404:
            errorTitle = 'Data Tidak Ditemukan!'
            errorMsg =
              responseData.message || 'Data yang diminta tidak ditemukan'
            errorIcon = 'info'
            break

          case 403:
            errorTitle = 'Akses Ditolak!'
            errorMsg = 'Anda tidak memiliki izin untuk melakukan aksi ini'
            errorIcon = 'warning'
            break

          case 500:
          case 502:
          case 503:
          case 504:
            errorTitle = 'Kesalahan Server!'
            errorMsg = 'Terjadi kesalahan pada server. Silakan coba lagi nanti'
            break

          default:
            errorMsg =
              responseData.message || `Terjadi kesalahan (Kode: ${status})`
        }
      } else if (error.request) {
        errorTitle = 'Koneksi Gagal!'
        errorMsg =
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda'
        errorIcon = 'warning'
      } else if (error.message) {
        errorMsg = error.message
      }

      Swal.fire({
        title: errorTitle,
        text: errorMsg,
        icon: errorIcon,
        confirmButtonColor: '#d33',
        customClass: {
          content: 'text-left',
        },
      })
    } finally {
      isSubmitting.value = false
    }
  }

  // ✅ Fungsi untuk handle upload CSV
  async function handleUploadCSV() {
    // Buat input file secara dinamis
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.style.display = 'none'

    input.onchange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validasi file
      if (!file.name.toLowerCase().endsWith('.csv')) {
        Swal.fire({
          title: 'File Tidak Valid!',
          text: 'Silakan pilih file dengan format .csv',
          icon: 'warning',
          confirmButtonColor: '#d33',
        })
        return
      }

      try {
        isUploadingCSV.value = true

        // TODO: Implementasi upload CSV ke API
        // const formData = new FormData()
        // formData.append('csv_file', file)
        // await pengadaanStore.uploadCSV(formData)

        // Simulasi upload (ganti dengan implementasi nyata)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        Swal.fire({
          title: 'Berhasil!',
          text: 'File CSV berhasil diupload',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      } catch (error) {
        Swal.fire({
          title: 'Upload Gagal!',
          text: error.message || 'Terjadi kesalahan saat mengupload file CSV',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
      } finally {
        isUploadingCSV.value = false
        // Cleanup
        document.body.removeChild(input)
      }
    }

    // Trigger file picker
    document.body.appendChild(input)
    input.click()
  }
</script>

<template>
  <SuperAdminLayout>
    <MainElement>
      <section class="flex flex-col justify-between h-full px-2 sm:px-4">
        <!-- TITLE -->
        <div
          class="text-center font-semibold text-sm sm:text-lg text-[#0099FF] underline sm:underline-offset-8 underline-offset-5 relative"
        >
          Form Data Pemohon
          <!-- ✅ Dot indikator perubahan -->
          <span
            v-if="hasUnsavedChanges"
            class="absolute -top-1 -right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"
            title="Ada perubahan yang belum disimpan"
          ></span>
        </div>

        <!-- NAV -->
        <div class="flex gap-2 items-center px-2 sm:px-0">
          <div
            @mouseenter="iconHover = true"
            @mouseleave="iconHover = false"
            class="flex gap-2 items-center cursor-pointer"
          >
            <PemohonIconElement
              :color="iconHover ? '#0099FF' : '#9BA1AA'"
              :innerColor="iconHover ? 'white' : 'white'"
            />
            <div
              :class="[
                'text-xs sm:text-sm font-poppins font-medium',
                iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
              ]"
            >
              Data Pemohon
            </div>
          </div>

          <div class="mt-0.5">
            <ArrowIconElement />
          </div>
          <div
            class="text-[#9BA1AA] text-xs sm:text-sm font-poppins font-medium"
          >
            Input Data
          </div>
        </div>

        <!-- FORM -->
        <FormPemohon ref="formRef" @form-changed="handleFormChanged" />

        <!-- BUTTON -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 mt-5 sm:mt-7.5 w-full px-2 sm:px-0"
        >
          <!-- Upload CSV Button (Custom) -->
          <button
            type="button"
            :disabled="
              isSubmitting || pengadaanStore?.isLoading || isUploadingCSV
            "
            class="bg-[#4CAF50] text-white rounded-lg h-10 sm:h-11 px-4 sm:px-6 md:px-9 font-medium sm:font-semibold text-sm sm:text-base cursor-pointer hover:scale-95 disabled:bg-green-300 disabled:cursor-not-allowed disabled:hover:scale-100 focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-all duration-200 ease-in-out order-3 sm:order-1 flex items-center justify-center gap-2"
            @click="handleUploadCSV"
          >
            <!-- Loading Spinner untuk Upload -->
            <svg
              v-if="isUploadingCSV"
              class="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <!-- Upload Icon (jika tidak loading) -->
            <svg
              v-if="!isUploadingCSV"
              class="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>

            <span>Upload CSV</span>
          </button>

          <!-- Clear Button -->
          <button
            type="button"
            :disabled="
              false ||
              isSubmitting ||
              pengadaanStore?.isLoading ||
              isUploadingCSV
            "
            class="bg-[#9BA1AA] text-white rounded-lg h-10 sm:h-11 px-4 sm:px-6 md:px-8 lg:px-11 font-medium sm:font-semibold text-sm sm:text-base cursor-pointer hover:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 focus:ring-2 focus:ring-[#9BA1AA] focus:ring-offset-2 transition-all duration-200 ease-in-out order-2 sm:order-2"
            @click="handleClear"
          >
            Clear
          </button>

          <!-- Save Button -->
          <button
            type="button"
            :disabled="
              isSubmitting || pengadaanStore?.isLoading || isUploadingCSV
            "
            class="bg-[#0099FF] text-white rounded-lg h-10 sm:h-11 px-6 sm:px-8 md:px-12 lg:px-20 font-medium sm:font-semibold text-sm sm:text-base cursor-pointer hover:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:hover:scale-100 focus:ring-2 focus:ring-offset-2 focus:ring-[#0099FF] transition-all duration-200 ease-in-out flex items-center justify-center gap-2 order-1 sm:order-3"
            @click="handleSubmit"
          >
            <!-- Loading Spinner -->
            <svg
              v-if="isSubmitting || pengadaanStore?.isLoading"
              class="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <span>Simpan</span>
          </button>
        </div>
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
