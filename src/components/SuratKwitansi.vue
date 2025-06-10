<script setup>
  import bulog from '@/assets/images/bulog.png'
  import { computed } from 'vue'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const bulanIndo = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const tanggalSurat = computed(() => {
    if (!props.item?.tanggal_pengadaan) return ''
    const [tahun, bulan, tanggal] = props.item.tanggal_pengadaan.split('-')
    return `${parseInt(tanggal)} ${bulanIndo[parseInt(bulan)]} ${tahun}`
  })

  const jenisPengadaanCapital = computed(() => {
    const str = props.item.jenis_pengadaan_barang || ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  })

  const tahunPengadaan = computed(() => {
    if (!props.item?.tanggal_pengadaan) return new Date().getFullYear()
    return new Date(props.item.tanggal_pengadaan).getFullYear()
  })
</script>

<template>
  <section class="flex justify-center w-full">
    <section class="w-[1147px]">
      <div class="flex w-full h-full px-2 py-1 font-calibri text-xl gap-x-4">
        <div class="relative outline w-[26%] h-[706px]">
          <div
            class="absolute bottom-0 my-15 -translate-x-3 flex flex-col -rotate-90"
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
            <div>Perum BULOG Kantor Cabang Surakarta</div>
            <div class="flex justify-between pr-1">
              <div>Uang sejumlah</div>
              <div class="text-end">:</div>
            </div>
            <div>
              [Empat juta sembilan ratus dua ribu delapan ratus lima belas
              rupiah]
            </div>
            <div class="flex justify-between pr-1">
              <div>Untuk Pembayaran</div>
              <div class="text-end">:</div>
            </div>
            <div>
              {{ jenisPengadaanCapital }} {{ item.kauntum }} sesuai dengan PO/{{
                item.no_preorder
              }}
              Tahun {{ tahunPengadaan }}
            </div>
          </div>
          <div class="grid grid-cols-[1fr_2.6fr]">
            <div class="col-start-2">
              <div class="grid grid-cols-2 w-[96%]">
                <div>Kuantum</div>
                <div class="text-end">{{ item.kuantum }}</div>
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
                <div class="text-center text-xl mt-2">
                  Surakarta, {{ tanggalSurat }}
                </div>
                <div class="text-center">
                  <div>{{ item.nama_suplier }}</div>
                  <div>{{ item.nama_perusahaan }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
