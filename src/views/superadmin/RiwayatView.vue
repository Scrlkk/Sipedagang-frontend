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
    <MainElement>
      <section class="flex flex-col justify-between h-full">
        <div>
          <!-- Search -->
          <section class="grid grid-cols-2">
            <div
              class="font-semibold text-lg text-[#0099FF] underline underline-offset-8"
            >
              Riwayat Pengadaan
            </div>
            <div class="flex justify-end mt-1 gap-4">
              <input
                type="text"
                placeholder="Search"
                v-model="searchText"
                class="border border-[#D9D9D9] rounded-md h-8 px-5 text-sm focus:outline-[#0099ff]"
              />
              <input
                type="month"
                v-model="searchMonth"
                class="border border-[#D9D9D9] rounded-md h-8 px-5 text-sm focus:outline-[#0099ff]"
                title="Filter berdasarkan bulan"
              />
            </div>
          </section>

          <!-- Table -->
          <section
            class="relative mt-4.5 text-sm overflow-x-auto overflow-y-auto pr-1.5 h-[62.8dvh]"
          >
            <div
              v-if="pengadaanStore.isLoading"
              class="flex justify-center items-center h-full"
            >
              <div class="text-gray-500">Memuat data...</div>
            </div>
            <div
              v-else-if="pengadaanStore.hasError"
              class="flex justify-center items-center h-full"
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
            <table v-else class="w-full">
              <thead class="sticky top-0">
                <tr class="bg-gray-100 text-gray-700 text-sm text-center">
                  <th class="px-5 py-3 rounded-tl-xl">Jenis Pengadaan</th>
                  <th class="px-4 py-3">No Preorder</th>
                  <th class="px-4 py-3">Supplier</th>
                  <th class="px-4 py-3">Perusahaan</th>
                  <th class="px-4 py-3">Admin</th>
                  <th class="px-4 py-3">Kuantum</th>
                  <th class="px-4 py-3">Tanggal</th>
                  <th class="px-4 py-3 rounded-tr-xl">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="data.length === 0">
                  <tr>
                    <td
                      colspan="8"
                      class="py-8 text-center text-[16px] text-gray-400"
                    >
                      {{
                        pengadaanStore.isLoading
                          ? 'Memuat data...'
                          : 'Tidak ada data yang sesuai'
                      }}
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
          </section>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center mt-5">
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
