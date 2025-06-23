<script setup>
  import { onMounted, ref, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import SuratPermohonan from '@/components/SuratPermohonan.vue'
  import SuratKwitansi from '@/components/SuratKwitansi.vue'
  import SuratDetailPengadaan from '@/components/SuratDetailPengadaan.vue'
  import ButtonPrintElement from '@/components/ButtonPrintElement.vue'

  const currentView = ref('surat')
  const pengadaanStore = usePengadaanStore()
  const route = useRoute()
  const pengadaan = ref(null)
  const isLoading = ref(true)

  onMounted(async () => {
    const id = route.params.id
    if (id) {
      try {
        pengadaan.value = await pengadaanStore.fetchPengadaanById(id)

        if (pengadaan.value) {
          await nextTick()
          isLoading.value = false

          setTimeout(() => {
            window.print()
          }, 300)
        } else {
          isLoading.value = false
        }
      } catch (error) {
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
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-white z-50 flex items-center justify-center px-4"
  >
    <div class="text-center max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
      <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
      <div class="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
        Memuat data dokumen...
      </div>
      <div class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
        Mohon tunggu sebentar
      </div>
      <div class="mt-3 sm:mt-4">
        <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div
            class="bg-blue-600 h-1.5 sm:h-2 rounded-full animate-pulse"
            style="width: 45%"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50 print:bg-white">
    <div class="print:hidden">
      <div class="sticky top-0 z-40 bg-white shadow-sm border-b">
        <ButtonPrintElement @toggle-view="handleToggleView" />
      </div>
    </div>    <!-- Section untuk Surat Permohonan dan Detail -->
    <section 
      v-if="currentView === 'surat' && pengadaan"
      class="surat-section m-2 sm:m-4 lg:m-[8mm] xl:m-[10mm] print:m-[10mm]">
      <div class="bg-white print:bg-transparent rounded-lg print:rounded-none shadow-sm print:shadow-none border print:border-none overflow-hidden">
        <div class="space-y-4 lg:space-y-0 p-4 sm:p-6 lg:p-8 print:p-0">
          <SuratPermohonan :item="pengadaan" />
          <div class="page-break">
            <SuratDetailPengadaan :item="pengadaan" />
          </div>
          <div class="page-break kuitansi-container kuitansi-page">
            <SuratKwitansi :item="pengadaan" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section khusus untuk Kuitansi -->
    <section 
      v-if="currentView === 'kuitansi' && pengadaan"
      class="kuitansi-section print:m-0">
      <div class="bg-white print:bg-transparent rounded-lg print:rounded-none shadow-sm print:shadow-none border print:border-none overflow-hidden">
        <div class="p-4 sm:p-6 lg:p-8 print:p-0">
          <div class="kuitansi-container kuitansi-page">
            <SuratKwitansi :item="pengadaan" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>  @media print {
    @page {
      size: A4 portrait;
      margin: 0mm;
    }

    @page kuitansi {
      size: A4 portrait;
      margin: 0mm;
    }

    .page-break {
      page-break-after: always;
    }    .kuitansi-page {
      page: kuitansi;
      display: block !important;
      min-height: 297mm;
      width: 210mm;
      padding-top: 40mm !important;
      padding-left: 15mm !important;
      padding-right: 5mm !important;
      padding-bottom: 10mm !important;
      box-sizing: border-box;
    }

    .kuitansi-container {
      /* Perkecil dan posisi di kiri atas dengan jarak dari atas yang jelas */
      transform: scale(0.6) !important;
      width: 1147px !important;
      height: 706px !important;
      margin: 0 !important;
      padding: 0 !important;
      transform-origin: left top !important;
      position: relative !important;
      top: 0 !important;
      left: 0 !important;
    }

    .kuitansi-page section {
      margin: 0 !important;
    }

    /* Maintain original kuitansi dimensions but scaled down */
    .kuitansi-page .w-\[1147px\] {
      width: 1147px !important;
      max-width: none !important;
    }

    .kuitansi-page .h-\[706px\] {
      height: 706px !important;
    }

    .fixed {
      display: none !important;
    }

    /* Ensure each page breaks properly */
    .page-break:last-child {
      page-break-after: auto;
    }

    /* Section-specific styles for print */
    .surat-section {
      margin: 10mm !important;
    }

    .kuitansi-section {
      margin: 0 !important;
      padding: 0 !important;
    }
  }

  @media screen and (max-width: 1280px) {
    .kuitansi-container {
      transform: scale(0.7);
    }
  }

  @media screen and (max-width: 1024px) {
    .kuitansi-container {
      transform: scale(0.6);
    }
  }

  @media screen and (max-width: 768px) {
    .kuitansi-container {
      transform: scale(0.5);
    }
  }

  @media screen and (max-width: 640px) {
    .kuitansi-container {
      transform: scale(0.4);
    }
  }
</style>
