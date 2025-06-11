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
    @page {
      size: A4;
      margin: 0mm;
    }

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
