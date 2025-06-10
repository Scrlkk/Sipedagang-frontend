<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import AdminLayout from '@/layouts/AdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import FormElement from '@/components/FormElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import Swal from 'sweetalert2'

  const formRef = ref(null)
  const isSubmitting = ref(false)
  const router = useRouter()
  const route = useRoute()
  const pengadaanStore = usePengadaanStore()

  // Check if this is edit mode based on route params
  const editId = computed(() => route.params.id)
  const isEditMode = computed(() => !!editId.value)

  onMounted(async () => {
    if (isEditMode.value) {
      try {
        console.log('Loading data for edit, ID:', editId.value)

        // Fetch data by ID
        await pengadaanStore.fetchPengadaanById(editId.value)

        // Wait for next tick to ensure FormElement is mounted
        await nextTick()

        // Use populateForm method from FormElement
        if (formRef.value && pengadaanStore.currentPengadaan) {
          console.log(
            'Populating form with data:',
            pengadaanStore.currentPengadaan,
          )
          formRef.value.populateForm(pengadaanStore.currentPengadaan)
        } else {
          console.error('FormRef or currentPengadaan not available:', {
            formRef: formRef.value,
            currentPengadaan: pengadaanStore.currentPengadaan,
          })
        }
      } catch (error) {
        console.error('Error loading data for edit:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Gagal memuat data untuk edit',
          icon: 'error',
          confirmButtonColor: '#d33',
        }).then(() => {
          router.push('/admin/lihatdata')
        })
      }
    }
  })

  function handleClear() {
    if (formRef.value && formRef.value.clearForm) {
      formRef.value.clearForm()
    }
  }

  async function handleSubmit() {
    if (!formRef.value) return

    isSubmitting.value = true

    try {
      if (isEditMode.value) {
        // Update existing data using updateForm method
        await formRef.value.updateForm(editId.value)

        await Swal.fire({
          title: 'Berhasil!',
          text: 'Data pengadaan berhasil diperbarui',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      } else {
        // Create new data using submitForm method
        await formRef.value.submitForm()

        await Swal.fire({
          title: 'Berhasil!',
          text: 'Data pengadaan berhasil disimpan',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }

      // Redirect ke halaman lihat data setelah sukses
      router.push('/admin/lihatdata')
    } catch (error) {
      let errorMsg = 'Terjadi kesalahan saat menyimpan data'

      // Handle validation errors or other errors
      if (error.message) {
        errorMsg = error.message
      } else if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors
        if (errors) {
          errorMsg = Object.values(errors).flat().join('\n')
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message
        }
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
  <AdminLayout class="h-screen overflow-hidden">
    <!-- Add transition wrapper -->
    <transition name="page" appear>
      <div class="flex flex-col min-h-[calc(100vh-120px)]">
        <!-- Mobile Navigation Bar (visible on small screens) -->
        <div
          class="lg:hidden flex justify-between items-center p-4 bg-white shadow-md z-30 border-b"
        >
          <router-link
            to="/admin/dashboard"
            class="bg-[#0099FF] text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-[#0088EE] transition-colors text-sm"
            aria-label="Kembali ke Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Dashboard</span>
          </router-link>
          <router-link
            to="/admin/lihatdata"
            class="bg-[#0099FF] text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-[#0088EE] transition-colors text-sm"
            aria-label="Lihat Data Permohonan"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Lihat Data</span>
          </router-link>
        </div>

        <!-- Main Content Area -->
        <div
          class="flex-1 flex justify-center items-center py-8 px-4 lg:px-8 relative min-h-0"
        >
          <!-- Loading state for edit mode -->
          <div
            v-if="pengadaanStore.isLoading && isEditMode"
            class="flex justify-center items-center h-full"
          >
            <div class="text-gray-500">Memuat data...</div>
          </div>

          <!-- Error state -->
          <div
            v-else-if="pengadaanStore.hasError && isEditMode"
            class="flex justify-center items-center h-full"
          >
            <div class="text-red-500 text-center">
              <p>{{ pengadaanStore.error }}</p>
              <button
                @click="router.push('/admin/lihatdata')"
                class="mt-2 px-4 py-2 bg-[#0099ff] text-white rounded hover:bg-blue-600"
              >
                Kembali ke Lihat Data
              </button>
            </div>
          </div>

          <!-- Main content -->
          <template v-else>
            <!-- Side Navigation (hidden on small screens) -->
            <div
              class="hidden lg:flex fixed left-4 xl:left-8 top-1/2 transform -translate-y-1/2 flex-col space-y-4 z-20"
            >
              <router-link
                to="/admin/dashboard"
                class="bg-[#0099FF] text-white rounded-full w-14 xl:w-16 h-14 xl:h-16 flex items-center justify-center shadow-lg hover:bg-[#0088EE] transition-colors group"
                aria-label="Kembali ke Dashboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 xl:h-7 w-6 xl:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <!-- Tooltip -->
                <div
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  Dashboard
                </div>
              </router-link>
              <router-link
                to="/admin/lihatdata"
                class="bg-[#0099FF] text-white rounded-full w-14 xl:w-16 h-14 xl:h-16 flex items-center justify-center shadow-lg hover:bg-[#0088EE] transition-colors group"
                aria-label="Lihat Data Permohonan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 xl:h-7 w-6 xl:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <!-- Tooltip -->
                <div
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  Lihat Data
                </div>
              </router-link>
            </div>

            <!-- Form Container dengan MainElement - Diperlebar dan dipusatkan -->
            <div
              class="w-full max-w-7xl mx-auto flex justify-center -mt-23 scale-85"
            >
              <div class="w-full max-w-6xl lg:ml-16 xl:ml-20">
                <MainElement class="w-full">
                  <section class="flex flex-col justify-between h-full">
                    <!-- TITLE -->
                    <div
                      class="text-center font-semibold text-xl text-[#0099FF] underline underline-offset-8 mb-6"
                    >
                      {{
                        isEditMode ? 'Edit Data Pengadaan' : 'Form Input Data'
                      }}
                    </div>

                    <!-- FORM -->
                    <FormElement ref="formRef" :isEditMode="isEditMode" />

                    <!-- BUTTON -->
                    <ButtonElement
                      @onClickLeft="handleClear"
                      @onClickRight="handleSubmit"
                      :rightLoading="isSubmitting || pengadaanStore.isLoading"
                      :rightLabel="isEditMode ? 'Update' : 'Simpan'"
                      leftLabel="Clear"
                    />
                  </section>
                </MainElement>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
  /* Page transition animations */
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
