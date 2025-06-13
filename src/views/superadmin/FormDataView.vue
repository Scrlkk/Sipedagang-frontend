<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import FormElement from '@/components/FormElement.vue'
  import InputIconElement from '@/components/InputIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import Swal from 'sweetalert2'

  const iconHover = ref(false)
  const formRef = ref(null)
  const isSubmitting = ref(false)
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

  const handleFormChanged = (hasChanges) => {
    hasUnsavedChanges.value = hasChanges
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

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
      let errorMsg = 'Terjadi kesalahan saat menyimpan data'
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors
        if (errors) {
          errorMsg = Object.values(errors).flat().join('\n')
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message
        }
      } else if (error.message) {
        errorMsg = error.message
      }

      Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#d33',
      })
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <SuperAdminLayout>    <MainElement>
      <section class="flex flex-col justify-between h-full px-2 sm:px-0">
        <!-- TITLE -->
        <div
          class="text-center font-semibold text-base sm:text-lg text-[#0099FF] underline underline-offset-8"
        >
          Form Input Data
        </div>

        <!-- NAV -->
        <div class="flex gap-2 items-center">
          <div
            @mouseenter="iconHover = true"
            @mouseleave="iconHover = false"
            class="flex gap-2 items-center cursor-pointer"
          >
            <InputIconElement
              :color="iconHover ? '#0099FF' : '#9BA1AA'"
              :innerColor="iconHover ? 'white' : 'white'"
            />
            <div
              :class="[
                'text-xs sm:text-sm font-poppins font-medium',
                iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
              ]"
            >
              Input
            </div>
          </div>

          <div class="mt-0.5">
            <ArrowIconElement />
          </div>
          <div class="text-[#9BA1AA] text-xs sm:text-sm font-poppins font-medium">
            Input Data
          </div>
        </div>

        <!-- FORM -->
        <FormElement ref="formRef" />

        <!-- BUTTON -->
        <ButtonElement
          @onClickLeft="handleClear"
          @onClickRight="handleSubmit"
          :rightLoading="isSubmitting || pengadaanStore?.isLoading"
          rightLabel="Simpan"
          leftLabel="Clear"
        />
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
