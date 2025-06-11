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

  watch([isLoading, formRef, currentData], ([loading, form, data]) => {
    if (!loading && form && form.populateForm && data) {
      form.populateForm(data)
    }
  })

  async function handleLeft() {
    const canLeave = await confirmLeave()
    if (canLeave) {
      bypassConfirmation.value = true
      router.push('/superadmin/riwayat')
    }
  }

  async function handleRight() {
    if (!formRef.value || !formRef.value.updateForm) {
      return
    }

    try {
      isSubmitting.value = true

      await formRef.value.updateForm(pengadaanId)

      hasUnsavedChanges.value = false
      bypassConfirmation.value = true

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
      let errorMessage = 'Terjadi kesalahan saat memperbarui data'

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors
        if (validationErrors) {
          const errorList = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n')
          errorMessage = `Validation Error:\n${errorList}`
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
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
      <section class="flex flex-col justify-between h-full">
        <div
          class="text-center font-semibold text-lg text-[#0099FF] underline underline-offset-8 relative"
        >
          Edit Riwayat Data
          <span
            v-if="hasUnsavedChanges"
            class="absolute -top-1 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"
            title="Ada perubahan yang belum disimpan"
          ></span>
        </div>

        <div
          class="flex gap-2 items-center text-[#9BA1AA] text-sm font-poppins font-medium"
        >
          <RouterLink
            to="/superadmin/riwayat"
            @mouseenter="iconHover = true"
            @mouseleave="iconHover = false"
            class="flex gap-2 justify-center items-center cursor-pointer"
          >
            <RiwayatIconElement
              :color="iconHover ? '#0099FF' : '#9BA1AA'"
              :innerColor="iconHover ? 'white' : 'white'"
            />
            <div
              :class="[
                'text-sm font-poppins font-medium',
                iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
              ]"
            >
              Riwayat
            </div>
          </RouterLink>
          <div class="mt-0.5">
            <ArrowIconElement />
          </div>
          <div class="text-sm hover:text-[#0099FF] cursor-pointer">
            {{ noPreorder }}
          </div>
          <div class="mt-0.5">
            <ArrowIconElement />
          </div>
          <div>Edit Data</div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center flex-1">
          <div class="text-gray-500">Memuat data...</div>
        </div>

        <FormElement
          v-else
          ref="formRef"
          :is-edit-mode="true"
          @form-changed="handleFormChanged"
        />

        <ButtonElement
          @onClickLeft="handleLeft"
          @onClickRight="handleRight"
          :rightLoading="isSubmitting || pengadaanStore.isLoading"
          rightLabel="Update"
          leftLabel="Back"
        />
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
