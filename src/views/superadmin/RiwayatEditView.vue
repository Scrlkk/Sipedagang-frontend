<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
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

  // Computed untuk menampilkan no preorder
  const noPreorder = computed(() => {
    return currentData.value?.no_preorder || 'Loading...'
  })

  // Fetch data saat component dimount
  onMounted(async () => {
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

  // Watcher untuk populate form setelah FormElement siap
  watch([isLoading, formRef, currentData], ([loading, form, data]) => {
    if (!loading && form && form.populateForm && data) {
      form.populateForm(data)
    }
  })

  function handleLeft() {
    router.back()
  }

  async function handleRight() {
    if (!formRef.value || !formRef.value.updateForm) {
      return
    }

    try {
      isSubmitting.value = true

      await formRef.value.updateForm(pengadaanId)

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
      <section class="flex flex-col justify-between h-full">
        <!-- TITLE -->
        <div
          class="text-center font-semibold text-lg text-[#0099FF] underline underline-offset-8"
        >
          Edit Riwayat Data
        </div>

        <!-- NAV -->
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

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center flex-1">
          <div class="text-gray-500">Memuat data...</div>
        </div>

        <!-- FORM -->
        <FormElement v-else ref="formRef" :is-edit-mode="true" />

        <!-- BUTTON -->
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
