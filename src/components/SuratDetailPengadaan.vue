<script setup>
  import { ref } from 'vue'
  import DataIn from '@/components/SuratDataInElement.vue'
  const datain = ref([
    {
      no: '1',
      tgl: '32/08/2445',
      kuantum: '100000',
    },
    {
      no: '1',
      tgl: '20/12/2025',
      kuantum: '18213999',
    },
    {
      no: '1',
      tgl: '20/12/2025',
      kuantum: '18213999',
    },
    {
      no: '3',
      tgl: '30/01/2026',
      kuantum: '999929',
    },
  ])

  const jumlah = ref(
    datain.value.reduce((acc, item) => acc + parseInt(item.kuantum), 0),
  )
</script>

<template>
  <section class="flex justify-center w-full">
    <!-- SURATE -->
    <div
      class="w-full max-w-[210mm] min-h-[297mm] font-arial text-black text-sm pt-[14.2mm] pb-[25.4mm] pr-[16mm] pl-[25.4mm]"
    >
      <!-- Header -->
      <div class="grid grid-cols-2 gap-y-2 gap-x-15">
        <div class="col-start-2">Surakarta, 19 September 2025</div>
        <div class="col-span-2">
          <div class="grid grid-cols-2 w-[37%]">
            <div>No</div>
            <div>:</div>
            <div>Hal</div>
            <div class="whitespace-nowrap">
              <div class="flex flex-col gap-y-2">
                <span>: Permohonan Pembayaran</span>
                <span class="ml-2">Pengadaan DN [Gabah]</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-start-2 flex flex-col gap-y-2">
          <span>Kepada</span>
          <span>Yth. Pemimpin / Wakil Pemimpin</span>
          <span>Perum BULOG Kantor Cabang Surakarta</span>
          <span>Jl. LU. Adisucipto No. 17 Surakarta</span>
        </div>
      </div>

      <!-- Isi Surat -->
      <div class="mt-1 flex flex-col text-justify gap-y-2">
        <div>Dengan Hormat,</div>
        <div>
          Menunjuk kontrak Purchashing Order (PO) No [1234/12/11C30/ 2024]
          Tanggal [19] Bulan [September] Tahun [2025]
        </div>
        <div
          class="grid grid-flow-col grid-rows-3 gap-y-2 gap-x-2 w-[40%] text-left whitespace-nowrap"
        >
          <!-- KANAN -->
          <div>Kuantum</div>
          <div>Jumlah diajukan untuk pembayaran</div>
          <div>Telah di-SPP-kan</div>

          <!-- KIRI -->
          <div>: <span>10 KG</span></div>
          <div>: <span>10 KG</span></div>
          <div>: <span>10000 KG</span></div>
        </div>
        <div>
          Dengan ini kami mengajukan permohonan pembayaran pengadaan Gabah
          sesuai IN :
        </div>

        <!-- DATA IN -->
        <div class="flex flex-col gap-y-2">
          <DataIn
            v-for="(datain, index) in datain"
            :key="index"
            :datain="datain"
          />
          <div class="ml-[263px]">Jumlah : {{ jumlah }} KG</div>
        </div>

        <!-- TERLAMPIR -->
        <div>Terlampir :</div>
        <div class="grid grid-cols-2 gap-y-2 w-[40%]">
          <div>PO</div>
          <div>: 1 Set</div>
          <div>Dokumen IN</div>
          <div>: 1 Set</div>
          <div>Sertifikat LHPK</div>
          <div>: 1 Set</div>
        </div>

        <!-- PENUTUP -->
        <div>
          Demikian atas terkabulnya permohonan tersebut diucapkan terima kasih.
        </div>

        <!-- BOTTOM -->
        <div class="grid grid-cols-2 gap-x-25 mt-2 font-calibri">
          <div class="outline flex flex-col gap-y-3 pt-2 pl-4 pb-24">
            <div class="text-center underline font-bold tracking-tighter">
              DISPOSISI :
            </div>
            <div class="italic">AM Administrasi dan Keuangan</div>

            <div class="flex">
              <div class="px-5">-</div>
              <div>Dibayarkan Sesuai ketentuan</div>
            </div>
            <div class="flex">
              <div class="px-5">-</div>
              <div>Tertib Administrasi</div>
            </div>
          </div>
          <div class="flex flex-col gap-y-25 items-center mr-12">
            <div>Pemohon</div>
            <div class="text-center">
              <div>[Punakawan]</div>
              <div>([UD. Ali Baba])</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
