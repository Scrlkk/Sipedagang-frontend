<script setup>
  import bulog from '@/assets/images/bulog.png'
  import { computed } from 'vue'
  import { useSettingPengadaanStore } from '@/stores/settingPengadaanStore'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const settingPengadaanStore = useSettingPengadaanStore()

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

  // ✅ Cari setting berdasarkan jenis pengadaan untuk harga per satuan
  const settingPengadaan = computed(() => {
    if (
      !props.item?.jenis_pengadaan_barang ||
      !settingPengadaanStore.pengaturanPengadaan.length
    ) {
      return null
    }

    return settingPengadaanStore.pengaturanPengadaan.find(
      (setting) =>
        setting.jenis_pengadaan_barang?.toLowerCase() ===
        props.item.jenis_pengadaan_barang.toLowerCase(),
    )
  })

  // ✅ Harga per satuan dari setting
  const hargaPerSatuan = computed(() => {
    if (settingPengadaan.value?.harga_per_satuan) {
      return parseFloat(settingPengadaan.value.harga_per_satuan)
    }
    return 0
  })

  // ✅ Gunakan nilai yang sudah dihitung dari backend
  const hargaSebelumPajak = computed(() => {
    return parseFloat(props.item?.harga_sebelum_pajak) || 0
  })

  const dpp = computed(() => {
    return parseFloat(props.item?.dpp) || 0
  })

  const ppnTotal = computed(() => {
    return parseFloat(props.item?.ppn_total) || 0
  })

  const pphTotal = computed(() => {
    return parseFloat(props.item?.pph_total) || 0
  })

  const nominal = computed(() => {
    return parseFloat(props.item?.nominal) || 0
  })

  // ✅ Format angka dengan separator ribuan
  const formatRupiah = (angka) => {
    if (!angka && angka !== 0) return '0'
    return new Intl.NumberFormat('id-ID').format(angka)
  }
</script>

<template>
  <section class="flex justify-center w-full">
    <section class="w-[210mm] h-[140mm]">
      <section
        class="w-full h-full grid grid-cols-[22%_78%] px-2 font-calibri text-sm"
      >
        <!-- KIRI -->
        <div class="border flex flex-col items-center relative h-[97%]">
          <div class="-rotate-90 absolute bottom-0 my-5.5 -translate-x-2">
            <div class="w-35">
              <img
                src="@/assets/images/bulog.png"
                alt="Logo Bulog"
                class="w-full h-full"
              />
            </div>
            <div class="font-bold tracking-tight leading-snug">
              <p>Perum BULOG</p>
              <p>Kantor Cabang Surakarta</p>
              <p>Jl. L.U Adisucipto No. 17</p>
              <p>Surakarta</p>
            </div>
          </div>
        </div>

        <!-- KANAN -->
        <div class="flex flex-col px-3">
          <div class="text-[42px] text-center -mt-3.5">KUITANSI</div>
          <div class="text-[18px] grid grid-cols-[34%_66%] mt-2">
            <div class="flex justify-between pr-1">
              <p>Telah terima dari</p>
              <p>:</p>
            </div>
            <div>Perum BULOG Kantor Cabang Surakarta</div>
            <div class="flex justify-between pr-1">
              <p>Uang sejumlah</p>
              <p>:</p>
            </div>
            <div>
              Empat juta sembilan ratus dua ribu delapan ratus lima belas rupiah
            </div>
            <div class="flex justify-between pr-1">
              <p>Untuk pembayaran</p>
              <p>:</p>
            </div>
            <div>
              {{ jenisPengadaanCapital }} {{ item.kuantum }} sesuai dengan PO/{{
                item.no_preorder
              }}
              Tahun {{ tahunPengadaan }}
            </div>

            <div class="col-start-2 flex flex-col">
              <div class="flex justify-between">
                <div>Kuantum</div>
                <div>{{ item.kuantum }}</div>
              </div>
              <div class="flex justify-between">
                <div>Harga</div>
                <!-- ✅ Gunakan harga per satuan dari setting -->
                <div>{{ formatRupiah(hargaPerSatuan) }}</div>
              </div>
              <div class="flex justify-between">
                <div>Harga Sebelum Pajak</div>
                <!-- ✅ Gunakan nilai yang sudah dihitung dari backend -->
                <div>{{ formatRupiah(hargaSebelumPajak) }}</div>
              </div>
              <div class="flex justify-between">
                <div>DPP</div>
                <!-- ✅ Gunakan nilai yang sudah dihitung dari backend -->
                <div>{{ formatRupiah(dpp) }}</div>
              </div>
              <div class="flex justify-between">
                <div>PPN 12%</div>
                <!-- ✅ Gunakan nilai yang sudah dihitung dari backend -->
                <div>{{ formatRupiah(ppnTotal) }}</div>
              </div>
              <div class="flex justify-between">
                <div>PPH 22</div>
                <!-- ✅ Gunakan nilai yang sudah dihitung dari backend -->
                <div>{{ formatRupiah(pphTotal) }}</div>
              </div>
              <div class="flex justify-between font-bold">
                <div>Nominal</div>
                <!-- ✅ Gunakan nilai yang sudah dihitung dari backend -->
                <div>{{ formatRupiah(nominal) }}</div>
              </div>

              <div class="text-center text-[16px]">
                <div>Surakarta, {{ tanggalSurat }}</div>

                <div class="mt-24">
                  <!-- ✅ Tampilkan nama supplier dari database -->
                  <div>{{ item.nama_suplier || 'Punakawan' }}</div>
                  <!-- ✅ Tampilkan nama perusahaan dari database -->
                  <div>{{ item.nama_perusahaan || 'UD. Ali Baba Sejati' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>
