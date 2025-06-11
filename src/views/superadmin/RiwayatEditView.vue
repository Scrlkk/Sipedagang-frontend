<script setup>
  import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import RiwayatIconElement from '@/components/RiwayatIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import FormElement from '@/components/FormElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import Swal from 'sweetalert2'

  const iconHover = ref(false)
  const formRef = ref(null)
  const isSubmitting = ref(false)
  const isLoading = ref(true)

  const router = useRouter()
  const route = useRoute()
  const pengadaanStore = usePengadaanStore()

  const pengadaanId = route.params.id
  const currentData = ref(null)

  // ✅ Tambahkan state untuk tracking perubahan
  const hasUnsavedChanges = ref(false)

  // Computed untuk menampilkan no preorder
  const noPreorder = computed(() => {
    return currentData.value?.no_preorder || 'Loading...'
  })

  // ✅ Fungsi konfirmasi sebelum meninggalkan halaman
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

  // ✅ Guard untuk navigasi Vue Router
  onBeforeRouteLeave(async (to, from) => {
    const canLeave = await confirmLeave()
    if (!canLeave) {
      return false // Batalkan navigasi
    }
  })

  // ✅ Guard untuk browser navigation
  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault()
      event.returnValue =
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?'
      return event.returnValue
    }
  }

  // ✅ Handler untuk form changes dari FormElement
  const handleFormChanged = (hasChanges) => {
    hasUnsavedChanges.value = hasChanges
  }

  // Fetch data saat component dimount
  onMounted(async () => {
    // Add beforeunload listener
    window.addEventListener('beforeunload', handleBeforeUnload)

    try {
      isLoading.value = true

      // Pastikan pengadaanStore memiliki method fetchPengadaanById
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
    // Remove beforeunload listener
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  // Watcher untuk populate form setelah FormElement siap
  watch([isLoading, formRef, currentData], ([loading, form, data]) => {
    if (!loading && form && form.populateForm && data) {
      form.populateForm(data)
    }
  })

  async function handleLeft() {
    const canLeave = await confirmLeave()
    if (canLeave) {
      router.back()
    }
  }

  async function handleRight() {
    if (!formRef.value || !formRef.value.updateForm) {
      return
    }

    try {
      isSubmitting.value = true

      await formRef.value.updateForm(pengadaanId)

      // ✅ Reset unsaved changes setelah berhasil update
      hasUnsavedChanges.value = false

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data berhasil diperbarui',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      })

      setTimeout(() => {
        router.push('/superadmin/riwayat')
      }, 2000)
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Terjadi kesalahan saat memperbarui data',
        icon: 'error',
        confirmButtonColor: '#d33',
      })
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <SuperAdminLayout>
    <MainElement>
      <section class="flex flex-col justify-between h-full px-2 sm:px-4 lg:px-0">
        <!-- TITLE -->
        <div class="text-center font-semibold text-base sm:text-lg lg:text-xl text-[#0099FF] underline underline-offset-4 lg:underline-offset-8 relative mb-3 sm:mb-4 lg:mb-6">
          Edit Riwayat Data
          <!-- Indikator unsaved changes -->
          <span
            v-if="hasUnsavedChanges"
            class="absolute -top-1 -right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"
            title="Ada perubahan yang belum disimpan"
          ></span>
        </div>

        <!-- NAV -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 items-center justify-center sm:justify-start text-[#9BA1AA] text-xs sm:text-sm lg:text-base font-poppins font-medium mb-4 sm:mb-6 lg:mb-8">
          <RouterLink
            to="/superadmin/riwayat"
            @mouseenter="iconHover = true"
            @mouseleave="iconHover = false"
            class="flex gap-1 sm:gap-2 justify-center items-center cursor-pointer hover:text-[#0099FF] transition-colors duration-200"
          >
            <RiwayatIconElement
              :color="iconHover ? '#0099FF' : '#9BA1AA'"
              :innerColor="iconHover ? 'white' : 'white'"
            />
            <div
              :class=" [
                'text-xs sm:text-sm lg:text-base font-poppins font-medium transition-colors duration-200',
                iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
              ]"
            >
              Riwayat
            </div>
          </RouterLink>
          <div class="hidden sm:block mt-0.5">
            <ArrowIconElement />
          </div>
          <div class="text-xs sm:text-sm lg:text-base hover:text-[#0099FF] cursor-pointer transition-colors duration-200 text-center sm:text-left max-w-[200px] sm:max-w-[300px] truncate">
            {{ noPreorder }}
          </div>
          <div class="hidden sm:block mt-0.5">
            <ArrowIconElement />
          </div>
          <div class="text-xs sm:text-sm lg:text-base">Edit Data</div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center flex-1 py-8 sm:py-12 lg:py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-500 mx-auto mb-3 lg:mb-4"></div>
            <div class="text-gray-500 text-sm sm:text-base lg:text-lg">Memuat data...</div>
            <div class="text-gray-400 text-xs sm:text-sm mt-1">Mohon tunggu sebentar</div>
          </div>
        </div>

        <!-- FORM -->
        <div v-else class="flex-1 py-2 sm:py-4 lg:py-6">
          <div class="max-w-full mx-auto">
            <FormElement
              ref="formRef"
              :is-edit-mode="true"
              @form-changed="handleFormChanged"
            />
          </div>
        </div>

        <!-- BUTTON -->
        <div class="mt-4 sm:mt-6 lg:mt-8 px-0 sm:px-4 lg:px-0">
          <ButtonElement
            @onClickLeft="handleLeft"
            @onClickRight="handleRight"
            :rightLoading="isSubmitting || pengadaanStore.isLoading"
            rightLabel="Update"
            leftLabel="Back"
          />
        </div>
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
