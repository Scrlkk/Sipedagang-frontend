<script setup>
  import { ref, onMounted, watch } from 'vue'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import RiwayatElement from '@/components/RiwayatElement.vue'
  import PageElement from '@/components/PageElement.vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'

  const pengadaanStore = usePengadaanStore()
  const data = ref([])
  const searchText = ref('')
  const searchMonth = ref('')
  const currentPage = ref(1)
  const totalPages = ref(1)

  async function fetchData(page = 1) {
    try {
      const res = await pengadaanStore.fetchPengadaan(
        page,
        10, // perPage
        searchText.value,
        searchMonth.value,
      )

      data.value = pengadaanStore.pengadaanList
      totalPages.value = res.last_page || 1
      currentPage.value = res.current_page || page
    } catch (error) {
      console.error('Error in fetchData:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })

  function handlePageChange(page) {
    fetchData(page)
  }

  let searchTimeout = null
  watch([searchText, searchMonth], () => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout
    searchTimeout = setTimeout(() => {
      currentPage.value = 1 // Reset to first page
      fetchData(1)
    }, 500) // 500ms delay
  })
</script>

<template>
  <SuperAdminLayout>
    <MainElement>      <section class="flex flex-col justify-between h-full">
        <div>
          <!-- Search -->
          <section class="flex flex-col lg:grid lg:grid-cols-2 gap-3 lg:gap-0">
            <div
              class="font-semibold text-sm sm:text-base lg:text-lg text-[#0099FF] underline underline-offset-4 lg:underline-offset-8 text-center lg:text-left"
            >
              Riwayat Pengadaan
            </div>
            <div class="flex flex-col sm:flex-row justify-center lg:justify-end gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="Search"
                v-model="searchText"
                class="border border-[#D9D9D9] rounded-md h-8 px-3 sm:px-5 text-xs sm:text-sm focus:outline-[#0099ff] focus:border-[#0099ff] transition-all duration-200 w-full sm:w-auto"
              />
              <input
                type="month"
                v-model="searchMonth"
                class="border border-[#D9D9D9] rounded-md h-8 px-3 sm:px-5 text-xs sm:text-sm focus:outline-[#0099ff] focus:border-[#0099ff] transition-all duration-200 w-full sm:w-auto"
                title="Filter berdasarkan bulan"
              />
            </div>
          </section>

          <!-- Table Container -->
          <section
            class="relative mt-3 sm:mt-4 lg:mt-4.5 text-xs sm:text-sm overflow-hidden rounded-lg shadow-sm border border-gray-100"
          >
            <!-- Mobile Card View -->
            <div class="block lg:hidden">
              <div
                v-if="pengadaanStore.isLoading"
                class="flex justify-center items-center h-64 bg-white"
              >
                <div class="text-gray-500 text-sm">Memuat data...</div>
              </div>
              <div
                v-else-if="pengadaanStore.hasError"
                class="flex justify-center items-center h-64 bg-white"
              >
                <div class="text-red-500 text-center p-4">
                  <p class="text-sm">{{ pengadaanStore.error }}</p>
                  <button
                    @click="fetchData(currentPage)"
                    class="mt-2 px-4 py-2 bg-[#0099ff] text-white rounded hover:bg-blue-600 text-xs"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
              <div v-else class="space-y-2 p-2 bg-gray-50 max-h-[calc(100vh-300px)] overflow-y-auto">
                <template v-if="data.length === 0">
                  <div class="py-12 text-center text-gray-400 bg-white rounded-lg">
                    <p class="text-sm">Tidak ada data yang sesuai</p>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(item, index) in data"
                    :key="item.id || index"
                    class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 space-y-2"
                  >
                    <!-- Mobile Card Content -->
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <h4 class="font-medium text-sm text-gray-900 mb-1">
                          {{ item.jenis_pengadaan_barang || '-' }}
                        </h4>
                        <p class="text-xs text-gray-600">
                          No: {{ item.no_preorder || '-' }}
                        </p>
                      </div>
                      <div class="flex space-x-1">
                        <button
                          @click="() => window.open(`/surat-preview/${item.id}`, '_blank')"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Cetak"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-.45-1 1-1 .45 1 1 1s.45-1 1-1zm-1-9H6v4h12V3z"/>
                          </svg>
                        </button>
                        <RouterLink :to="`/superadmin/riwayat-edit/${item.id}`" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full transition-colors" title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span class="text-gray-500">Supplier:</span>
                        <p class="font-medium text-gray-900 truncate">{{ item.nama_suplier || '-' }}</p>
                      </div>
                      <div>
                        <span class="text-gray-500">Perusahaan:</span>
                        <p class="font-medium text-gray-900 truncate">{{ item.nama_perusahaan || '-' }}</p>
                      </div>
                      <div>
                        <span class="text-gray-500">Admin:</span>
                        <p class="font-medium text-gray-900 truncate">{{ item.user?.name || 'Unknown' }}</p>
                      </div>
                      <div>
                        <span class="text-gray-500">Kuantum:</span>
                        <p class="font-medium text-gray-900">{{ item.kuantum || '-' }}</p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 text-right pt-1 border-t border-gray-100">
                      {{ new Date(item.tanggal_pengadaan || item.tanggal).toLocaleDateString('id-ID') || '-' }}
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
              <div
                v-if="pengadaanStore.isLoading"
                class="flex justify-center items-center h-64"
              >
                <div class="text-gray-500">Memuat data...</div>
              </div>
              <div
                v-else-if="pengadaanStore.hasError"
                class="flex justify-center items-center h-64"
              >
                <div class="text-red-500 text-center">
                  <p>{{ pengadaanStore.error }}</p>
                  <button
                    @click="fetchData(currentPage)"
                    class="mt-2 px-4 py-2 bg-[#0099ff] text-white rounded hover:bg-blue-600"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
              <table v-else class="w-full min-w-[800px]">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-gray-100 text-gray-700 text-sm text-center">
                    <th class="px-3 xl:px-5 py-3 rounded-tl-xl text-left">Jenis Pengadaan</th>
                    <th class="px-2 xl:px-4 py-3">No Preorder</th>
                    <th class="px-2 xl:px-4 py-3">Supplier</th>
                    <th class="px-2 xl:px-4 py-3">Perusahaan</th>
                    <th class="px-2 xl:px-4 py-3">Admin</th>
                    <th class="px-2 xl:px-4 py-3">Kuantum</th>
                    <th class="px-2 xl:px-4 py-3">Tanggal</th>
                    <th class="px-2 xl:px-4 py-3 rounded-tr-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="data.length === 0">
                    <tr>
                      <td
                        colspan="8"
                        class="py-12 text-center text-gray-400"
                      >
                        Tidak ada data yang sesuai
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <RiwayatElement
                      v-for="(item, index) in data"
                      :key="item.id || index"
                      :item="item"
                      :class="[
                        index % 2 === 0 ? 'bg-[#efefef]' : 'bg-[#f5f5f540]',
                        'text-center',
                      ]"
                    />
                  </template>
                </tbody>
              </table>
            </div>
          </section>
        </div>        <!-- Pagination -->
        <div class="flex items-center justify-center mt-3 sm:mt-4 lg:mt-5">
          <PageElement
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="handlePageChange"
          />
        </div>
      </section>
    </MainElement>
  </SuperAdminLayout>
</template>
