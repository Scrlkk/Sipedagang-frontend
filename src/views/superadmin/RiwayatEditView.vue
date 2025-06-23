<script setup>
  import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import RiwayatIconElement from '@/components/RiwayatIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import FormElement from '@/components/FormElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import Swal from 'sweetalert2'

  const iconHover = ref(false)
  const formRef = ref(null)
  const isSubmitting = ref(false)
  const isLoading = ref(true)
  const hasUnsavedChanges = ref(false)
  const currentData = ref(null)
  const bypassConfirmation = ref(false)

  const router = useRouter()
  const route = useRoute()
  const pengadaanStore = usePengadaanStore()
  const pengadaanId = route.params.id

  const noPreorder = computed(() => {
    return currentData.value?.no_preorder || 'Loading...'
  })

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
    if (bypassConfirmation.value) {
      bypassConfirmation.value = false
      return true
    }

    const canLeave = await confirmLeave()
    if (!canLeave) {
      return false
    }
    return true
  })

  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault()
      event.returnValue =
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?'
      return event.returnValue
    }
  }

  const handleFormChanged = (hasChanges) => {
    hasUnsavedChanges.value = hasChanges
  }

  onMounted(async () => {
    window.addEventListener('beforeunload', handleBeforeUnload)

    try {
      isLoading.value = true

      if (!pengadaanStore.fetchPengadaanById) {
        throw new Error('Method fetchPengadaanById tidak ditemukan')
      }

      const data = await pengadaanStore.fetchPengadaanById(pengadaanId)

      if (!data) {
        throw new Error('Data tidak ditemukan')
      }

      currentData.value = data
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Gagal memuat data',
        text: error.message || 'Data tidak ditemukan atau terjadi kesalahan',
        showConfirmButton: false,
        timer: 2000,
      })
      router.push('/superadmin/riwayat')
    } finally {
      isLoading.value = false
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  // ✅ IMPROVED: Watch dengan better error handling
  watch(
    [isLoading, formRef, currentData],
    ([loading, form, data]) => {
      if (!loading && form && data) {
        try {
          console.log('Attempting to populate form with data:', data)

          if (form.populateForm && typeof form.populateForm === 'function') {
            form.populateForm(data)
            console.log('Form populated successfully')
          } else {
            console.error('populateForm method not available on form ref')
          }
        } catch (error) {
          console.error('Error populating form:', error)

          Swal.fire({
            title: 'Error!',
            text: `Gagal memuat data ke form: ${error.message}`,
            icon: 'error',
            confirmButtonColor: '#d33',
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'rounded-lg font-medium px-4 py-2 text-sm',
            },
          })
        }
      }
    },
    { immediate: true },
  )

  async function handleLeft() {
    const canLeave = await confirmLeave()
    if (canLeave) {
      bypassConfirmation.value = true
      router.push('/superadmin/riwayat')
    }
  }

  async function handleRight() {
    if (!formRef.value) {
      console.error('Form ref not available')
      return
    }

    try {
      isSubmitting.value = true

      // ✅ FIXED: Get form data dan kirim sebagai parameter
      if (typeof formRef.value.getFormData === 'function') {
        const formData = formRef.value.getFormData()
        console.log('Form data before update:', formData)
        console.log('Pengadaan ID:', pengadaanId)

        // ✅ FIXED: Call updateForm dengan data yang lengkap
        if (typeof formRef.value.updateForm === 'function') {
          await formRef.value.updateForm(pengadaanId, formData)
        } else {
          throw new Error('updateForm method tidak tersedia pada form')
        }
      } else {
        throw new Error('getFormData method tidak tersedia pada form')
      }

      hasUnsavedChanges.value = false
      bypassConfirmation.value = true

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data berhasil diperbarui',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-xl',
        },
      })

      setTimeout(() => {
        router.push('/superadmin/riwayat')
      }, 2000)
    } catch (error) {
      console.error('Update error:', error)
      console.error('Error response:', error.response)

      let errorMessage = 'Terjadi kesalahan saat memperbarui data'

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors
        if (validationErrors) {
          const errorList = Object.entries(validationErrors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages]
              return `${field}: ${msgArray.join(', ')}`
            })
            .join('\n')
          errorMessage = `Validation Error:\n${errorList}`
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.response?.status === 400) {
        errorMessage = `Bad Request: ${error.response.data.message || 'Request tidak valid'}`
      } else if (error.message) {
        errorMessage = error.message
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#d33',
        customClass: {
          content: 'whitespace-pre-line',
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg font-medium px-4 py-2 text-sm',
        },
      })
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <SuperAdminLayout>
    <MainElement>
      <section class="flex flex-col justify-between h-full px-2 sm:px-4">
        <!-- TITLE -->
        <div
          class="text-center font-semibold text-sm sm:text-lg text-[#0099FF] underline sm:underline-offset-8 underline-offset-5 relative pb-2"
        >
          Edit Data {{ noPreorder }}
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
            @click="handleLeft"
          >
            <RiwayatIconElement
              :color="iconHover ? '#0099FF' : '#9BA1AA'"
              :innerColor="iconHover ? 'white' : 'white'"
            />
            <div
              :class="[
                'text-xs sm:text-sm font-poppins font-medium',
                iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
              ]"
            >
              Riwayat
            </div>
          </div>

          <div class="mt-0.5">
            <ArrowIconElement />
          </div>
          <div
            class="text-[#9BA1AA] text-xs sm:text-sm font-poppins font-medium"
          >
            Edit Data
          </div>
        </div>

        <!-- FORM -->
        <div v-if="isLoading" class="flex justify-center items-center flex-1">
          <div class="text-gray-500">Loading...</div>
        </div>

        <FormElement
          v-else
          ref="formRef"
          :is-edit-mode="true"
          @form-changed="handleFormChanged"
        />

        <!-- BUTTON -->
        <ButtonElement
          @onClickLeft="handleLeft"
          @onClickRight="handleRight"
          :rightLoading="isSubmitting || pengadaanStore?.isLoading"
          rightLabel="Update"
          leftLabel="Kembali"
        />
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
