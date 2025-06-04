<script setup>
  import SuratPermohonan from '@/components/SuratPermohonan.vue'
  import SuratKwitansi from '@/components/SuratKwitansi.vue'
  import SuratDetailPengadaan from '@/components/SuratDetailPengadaan.vue'
  import ButtonPrintElement from '@/components/ButtonPrintElement.vue'
  import { onMounted, ref } from 'vue'

  const currentView = ref('surat')

  onMounted(() => {
    window.print()
  })

  const handleToggleView = (view) => {
    currentView.value = view
  }
</script>

<template>
  <ButtonPrintElement @toggle-view="handleToggleView" />
  <section class="m-[10mm]">
    <div v-if="currentView === 'surat'">
      <SuratPermohonan />
      <div class="page-break">
        <SuratDetailPengadaan />
      </div>
    </div>
    <div v-if="currentView === 'kuitansi'">
      <div class="kuitansi-container kuitansi-page">
        <SuratKwitansi />
      </div>
    </div>
  </section>
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
      size: A4 landscape;
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
