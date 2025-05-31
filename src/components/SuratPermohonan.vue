<script setup>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const id = route.params.id

  onMounted(() => {
    setTimeout(() => {
      window.print()
    }, 500)
  })
</script>

<template>
  <section class="flex justify-center w-full">
    <!-- SURATE -->
    <div
      class="w-full max-w-[210mm] min-h-[297mm] font-arial text-black pt-[14.2mm] pb-[25.4mm] pr-[16mm] pl-[25.4mm] bg-amber-300"
    >
      <!-- Header -->
      <div class="text-center font-times">
        <div class="m-0 font-bold uppercase leading-none text-lg">
          SURAT PERMOHONAN PEMBAYARAN
        </div>
        <div class="m-0 font-bold uppercase text-lg">
          PENGADAAN GABAH/BERAS DALAM NEGERI TAHUN 2025
        </div>
      </div>

      <!-- KPD -->
      <div class="mt-11 font-arial text-sm">
        <div>Kepada Yth.</div>
        <div class="flex flex-col font-bold">
          Pemimpin/Wakil Pemimpin
          <span>Perum BULOG Kantor Cabang Surakarta</span>
        </div>
        <div>Di Tempat</div>
      </div>

      <!-- Isi Surat -->
      <div class="text-justify font-arial text-sm">
        <!-- 1 -->
        <div class="mt-11">
          Bersama ini kami [UD. Ali Baba] menyampaikan permohonan pembayaran
          [Gabah]
          <span class="font-bold">Pengadaan Dalam Negeri Tahun 2025</span>
          sebanyak [100.000] Kg dengan bukti dokumen terlampir.
        </div>

        <!-- 2 -->
        <div class="mt-4">
          Mohon kiranya harga [Gabah] tersebut di atas dapat dibayar /
          dipindahbukukan ke rekening Kami Bank [BRI] sebagaimana No Rekening
          [1234567891011] Sesuai PO No [1234/12/11C30/2024] Tanggal [19] Bulan
          [September] Tahun [2025]
        </div>

        <!-- 3 -->
        <div class="mt-4">
          Demikian disampaikan dan atas perkenannya diucapkan terima kasih.
        </div>
      </div>

      <!-- TTD -->
      <div
        class="flex flex-col mt-16 font-arial text-sm w-[37%] text-center mx-[63%]"
      >
        <div>Surakarta, 31 September 2025</div>
        <div class="">
          <div>Pemohon</div>
          <div class="mt-17">[Punakawan]</div>
          <div>[UD. Ali Baba]</div>
        </div>
      </div>
    </div>
  </section>
</template>
