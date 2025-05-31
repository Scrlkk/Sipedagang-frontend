<script setup>
import bulog from '@/assets/images/bulog.png'
  
</script>

<template>
  <section class="w-[1147px] h-[768px] bg-white">
    <div class="flex w-full h-full px-2 py-1 font-calibri text-xl gap-x-4">
      <div class="relative outline w-[26%] h-[94%]">
        <div
          class="absolute bottom-0 my-15 -translate-x-5 flex flex-col -rotate-90"
        >
          <img :src="bulog" class="w-[78%] pb-1" />
          <div class="font-bold leading-6">
            <div>Perum BULOG</div>
            <div>Kantor Cabang Surakarta</div>
            <div>Jl. L.U Adisucipto No. 17</div>
            <div>Surakarta</div>
          </div>
        </div>
      </div>
      <div class="w-full h-full text-[25px]">
        <div class="text-center text-5xl">KUITANSI</div>
        <div class="grid grid-cols-[1fr_2.6fr] pt-6">
          <div class="flex justify-between pr-1">
            <div>Telah terima dari</div>
            <div class="text-end">:</div>
          </div>
          <div>[Perum BULOG Kantor Cabang Surakarta]</div>
          <div class="flex justify-between pr-1">
            <div>Uang sejumlah</div>
            <div class="text-end">:</div>
          </div>
          <div>
            [Empat juta sembilan ratus dua ribu delapan ratus lima belas rupiah]
          </div>
          <div class="flex justify-between pr-1">
            <div>Untuk Pembayaran</div>
            <div class="text-end">:</div>
          </div>
          <div>
            [Pembelian Teh Celup Sariwangi 50 gr] sesuai dengan
            [PO/1234/12/11C30/2024 Tahun 2024]
          </div>
        </div>
        <div class="grid grid-cols-[1fr_2.6fr]">
          <div class="col-start-2">
            <div class="grid grid-cols-2 w-[96%]">
              <div>Kuantum</div>
              <div class="text-end">1.000</div>
              <div>Harga</div>
              <div class="text-end">5.525</div>
              <div class="font-bold">Harga Sebelum Pajak</div>
              <div class="text-end">5.525.000</div>
              <div>DPP</div>
              <div class="text-end">4.977.477</div>
              <div>PPN 12%</div>
              <div class="text-end">547.523</div>
              <div>PPH 22</div>
              <div class="text-end">74.662</div>
              <div>Nominal</div>
              <div class="text-end">4.902.615</div>
            </div>
            <div class="h-[70%] flex flex-col justify-between">
              <div class="text-center text-xl">
                Surakarta, [18 Oktober 2025]
              </div>
              <div class="text-center">
                <div>[Punakawan]</div>
                <div>[Perum BULOG SURAKARTA CABANG JOGJA SURAKRTA ]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
