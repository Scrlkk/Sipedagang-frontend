<script setup>
  defineProps({
    item: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <section class="flex justify-center w-full">
    <!-- SURATE -->
    <div class="w-[210mm] h-[297mm] font-arial text-black px-7 pl-12 pt-1">
      <!-- Header -->
      <div class="text-center font-times">
        <div class="m-0 font-bold uppercase leading-none text-[18px]">
          SURAT PERMOHONAN PEMBAYARAN
        </div>
        <div class="m-0 font-bold uppercase text-[18px]">
          PENGADAAN GABAH/BERAS DALAM NEGERI TAHUN 2025
        </div>
      </div>

      <!-- KPD -->
      <div class="mt-14 font-arial text-[13.5px]">
        <div>Kepada Yth.</div>
        <div class="flex flex-col font-bold">
          Pemimpin/Wakil Pemimpin
          <span>Perum BULOG Kantor Cabang Surakarta</span>
        </div>
        <div>Di Tempat</div>
      </div>

      <!-- Isi Surat -->
      <div class="text-justify font-arial text-[13.5px]">
        <!-- 1 -->
        <div class="mt-14">
          Bersama ini kami [UD. Ali Baba] menyampaikan permohonan pembayaran
          [Gabah]
          <span class="font-bold">Pengadaan Dalam Negeri Tahun 2025</span>
          sebanyak [100.000] Kg dengan bukti dokumen terlampir.
        </div>

        <!-- 2 -->
        <div class="mt-2.5">
          Mohon kiranya harga [Gabah] tersebut di atas dapat dibayar /
          dipindahbukukan ke rekening Kami Bank [BRI] sebagaimana No Rekening
          [1234567891011] Sesuai PO No [1234/12/11C30/2024] Tanggal [19] Bulan
          [September] Tahun [2025]
        </div>

        <!-- 3 -->
        <div class="mt-2.5">
          Demikian disampaikan dan atas perkenannya diucapkan terima kasih.
        </div>
      </div>

      <!-- TTD -->
      <div
        class="flex flex-col mt-22 font-arial text-[13.5px] w-[37%] text-center mx-[63%]"
      >
        <div>Surakarta, 31 September 2025</div>
        <div>
          <div>Pemohon</div>
          <div class="mt-17">[Punakawan]</div>
          <div>[UD. Ali Baba]</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  @media print {
    @page {
      size: A4;
      margin: 3rem;
    }
    body {
      margin: 4rem;
      padding: 0;
    }
  }
</style>
