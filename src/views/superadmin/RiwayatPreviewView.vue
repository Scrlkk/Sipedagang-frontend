<script setup>
  import SuratPermohonan from '@/components/SuratPermohonan.vue'
  import SuratKwitansi from '@/components/SuratKwitansi.vue'
  import SuratDetailPengadaan from '@/components/SuratDetailPengadaan.vue'
  import ButtonPrintElement from '@/components/ButtonPrintElement.vue'
  import { onMounted, ref, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePengadaanStore } from '@/stores/pengadaanStore'

  const currentView = ref('surat')
  const pengadaanStore = usePengadaanStore()
  const route = useRoute()
  const pengadaan = ref(null)
  const isLoading = ref(true)

  onMounted(async () => {
    const id = route.params.id
    if (id) {
      try {
        console.log('Fetching pengadaan data...')

        // Fetch data
        pengadaan.value = await pengadaanStore.fetchPengadaanById(id)

        if (pengadaan.value) {
          console.log('Data berhasil dimuat, mempersiapkan print...')

          // Tunggu DOM update
          await nextTick()

          // Set loading false
          isLoading.value = false

          // Print setelah data siap
          setTimeout(() => {
            console.log('Memulai print...')
            window.print()
          }, 300)
        } else {
          console.error('Data tidak ditemukan')
          isLoading.value = false
        }
      } catch (error) {
        console.error('Error fetching pengadaan:', error)
        isLoading.value = false
      }
    } else {
      isLoading.value = false
    }
  })

  const handleToggleView = (view) => {
    currentView.value = view
  }
</script>

<template>
  <!-- Loading indicator -->
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-white z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <div class="text-lg font-medium text-gray-700">
        Memuat data dokumen...
      </div>
    </div>
  </div>

  <div v-else>
    <ButtonPrintElement @toggle-view="handleToggleView" />
    <section class="m-[10mm]">
      <div v-if="currentView === 'surat' && pengadaan">
        <SuratPermohonan :item="pengadaan" />
        <div class="page-break">
          <SuratDetailPengadaan :item="pengadaan" />
        </div>
      </div>
      <div v-if="currentView === 'kuitansi' && pengadaan">
        <div class="kuitansi-container kuitansi-page">
          <SuratKwitansi :item="pengadaan" />
        </div>
      </div>
    </section>
  </div>
</template>

<style>
  @media print {
    /* Default page untuk surat-surat */
    @page {
      size: A4;
      margin: 0mm;
    }

    /* Page khusus untuk kuitansi */
    @page kuitansi {
      size: A4 Landscape;
      margin: 0mm;
      padding-top: 0mm;
    }

    .page-break {
      page-break-after: always;
    }

    .kuitansi-page {
      page: kuitansi;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kuitansi-container {
      transform: none !important;
      margin: 0 !important;
      margin-top: -17px !important;
      padding: 0 !important;
    }

    .kuitansi-page section {
      margin: 0 !important;
    }
    .fixed {
      display: none !important;
    }
  }
  .kuitansi-container {
    transform: scale(0.7);
  }
</style>
