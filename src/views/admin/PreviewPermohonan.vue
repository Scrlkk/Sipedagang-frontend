<script setup>
  import { ref, computed, onMounted } from 'vue'

  const formData = ref({
    namaSupplier: '',
    namaPerusahaan: '',
    jenisBank: '',
    nomerRekening: '',
    nomerPO: '',
    tanggalPengadaan: '',
    jenisPengadaan: '',
    kuantum: '',
    satuan: 'KG', // Add default satuan
    dataIN: [], // Array to store IN entries
  })

  // Load form data from localStorage on component mount
  onMounted(() => {
    const savedData = localStorage.getItem('permohonanFormData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        // Ensure dataIN is always initialized as an array
        if (!parsedData.dataIN || !Array.isArray(parsedData.dataIN)) {
          parsedData.dataIN = []
        }

        // If dataIN is empty but we have kuantum and satuan, create a default entry
        if (parsedData.dataIN.length === 0 && parsedData.kuantum) {
          parsedData.dataIN.push({
            tanggal: parsedData.tanggalPengadaan,
            kuantum: parsedData.kuantum,
            satuan: parsedData.satuan || 'KG',
          })
        }

        formData.value = parsedData
        console.log('Loaded formData with dataIN:', formData.value.dataIN)
      } catch (error) {
        console.error('Error parsing form data:', error)
      }
    }

    // Check if auto-print is requested
    const autoPrint = localStorage.getItem('autoPrint')
    if (autoPrint === 'true') {
      // Clear the auto-print flag
      localStorage.removeItem('autoPrint')

      // Give a small delay for the document to render properly before printing
      setTimeout(() => {
        printDocument()
      }, 500)
    }
  })

  // Format tanggalPengadaan into separate day, month, year
  const tanggalFormatted = computed(() => {
    if (!formData.value.tanggalPengadaan)
      return { day: '', month: '', year: '' }

    const date = new Date(formData.value.tanggalPengadaan)
    const months = [
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

    return {
      day: date.getDate().toString(),
      month: months[date.getMonth()],
      year: date.getFullYear().toString(),
    }
  })

  // Get current date for the letter date
  const currentDate = computed(() => {
    const today = new Date()
    const months = [
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

    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`
  })

  // Function to format tanggal from ISO string to dd/mm/yyyy
  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-'

    try {
      const date = new Date(isoDate)
      if (isNaN(date.getTime())) return isoDate // Return original if invalid date

      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      return isoDate // Return the original if parsing fails
    }
  }

  // Function to get month name
  const getMonthName = (monthIndex) => {
    const months = [
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
    return months[monthIndex]
  }

  // Function to get formatted date for the letter header
  const getFormattedHeaderDate = () => {
    const today = new Date()
    return `Surakarta, ${today.getDate()} ${getMonthName(today.getMonth())} ${today.getFullYear()}`
  }

  // Function to calculate total kuantum from dataIN
  const calculateTotalKuantum = (numberOnly = false) => {
    if (!formData.value.dataIN || formData.value.dataIN.length === 0) {
      return (
        formData.value.kuantum + (numberOnly ? '' : ` ${formData.value.satuan}`)
      )
    }

    const total = formData.value.dataIN.reduce((sum, item) => {
      const kuantum = parseFloat(item.kuantum) || 0
      return sum + kuantum
    }, 0)

    return total + (numberOnly ? '' : ` ${formData.value.satuan}`)
  }

  // Function to format currency in Indonesian Rupiah format
  const formatRupiah = (amount) => {
    if (!amount) return 'Rp 0'

    // First, clean the input if it has formatting characters
    let cleanAmount =
      typeof amount === 'string'
        ? amount.replace(/[^\d,.-]/g, '') // Remove all non-numeric characters except decimal and minus
        : amount

    // Convert to number and ensure it's a valid number
    const number = parseFloat(cleanAmount)
    if (isNaN(number)) return 'Rp 0'

    // Format the number with thousand separators using localization
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)
  }
  const printDocument = () => {
    window.print()
  }
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Tombol Print yang hanya muncul di layar (tidak saat mencetak) -->
    <div class="w-full max-w-[210mm] py-4 px-12 mx-auto print:hidden">
      <div class="flex justify-between items-center">
        <button
          @click="$router.go(-1)"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          Kembali
        </button>
        <button
          @click="printDocument"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          Cetak Dokumen
        </button>
      </div>
    </div>

    <div class="flex justify-center flex-col">
      <!-- Halaman Pertama -->
      <div
        class="w-full max-w-[210mm] min-h-[297mm] p-10 px-12 mx-auto font-arial leading-normal text-black relative print:shadow-none page"
      >
        <div class="text-center mb-12">
          <h1 class="m-0 font-bold text-lg uppercase font-times">
            SURAT PERMOHONAN PEMBAYARAN
          </h1>
          <h2 class="m-0 font-bold text-lg uppercase font-times">
            PENGADAAN GABAH/BERAS DALAM NEGERI TAHUN 2025
          </h2>
        </div>

        <div class="mt-8">
          <p class="m-0 leading-loose">Kepada Yth.</p>
          <p class="m-0 leading-loose">Pemimpin/Wakil Pemimpin</p>
          <p class="m-0 leading-loose">Perum BULOG Kantor Cabang Surakarta</p>
          <p class="m-0 leading-loose">Di Tempat</p>
        </div>

        <div class="mt-8 text-justify text-base">
          <p class="leading-loose mb-0">
            Bersama ini kami,
            <span>{{ formData.namaPerusahaan }}</span>
            menyampaikan permohonan pembayaran
            <span>{{ formData.jenisPengadaan }}</span>
            Pengadaan Dalam Negeri Tahun 2025 sebanyak
            <span>{{ calculateTotalKuantum() }}</span>
            dengan bukti dokumen terlampir.
          </p>

          <p class="mt-4 leading-loose mb-0">
            Mohon kiranya harga
            <span>{{ formData.jenisPengadaan }}</span>
            tersebut di atas dapat dibayar / dipindahbukukan ke rekening Kami
            Bank
            <span>{{ formData.jenisBank }}</span>
            sebagaimana No Rekening
            <span>{{ formData.nomerRekening }}</span>
            Sesuai PO No
            <span>{{ formData.nomerPO }}</span>
          </p>

          <p class="mt-4 leading-loose mb-0">
            Tanggal
            <span>{{ tanggalFormatted.day }}</span>
            Bulan
            <span>{{ tanggalFormatted.month }}</span>
            Tahun
            <span>{{ tanggalFormatted.year }}</span>
          </p>

          <p class="mt-4 leading-loose mb-0">
            Demikian disampaikan dan atas perkenannya diucapkan terima kasih.
          </p>
        </div>
        <p class="text-right">
          Surakarta, <span>{{ currentDate }}</span>
        </p>
        <p class="text-right">Pemohon</p>

        <div class="h-16"></div>

        <p class="text-right mt-10">
          <span>{{ formData.namaPerusahaan }}</span>
        </p>
        <p class="text-right">
          <span>({{ formData.namaSupplier }})</span>
        </p>
      </div>

      <!-- Halaman Kedua - Format Surat Permohonan Pembayaran -->
      <div
        class="w-full max-w-[210mm] min-h-[297mm] p-10 px-12 mx-auto font-arial leading-normal text-black relative print:shadow-none page"
      >
        <!-- Header dengan format seperti di gambar -->
        <div class="flex justify-between mb-5">
          <div></div>
          <div class="text-right">
            <p class="m-0">Surakarta, {{ currentDate }}</p>
          </div>
        </div>

        <!-- Nomor, Hal, dan detail -->
        <div class="flex gap-2 mb-1">
          <div class="w-16">No</div>
          <div class="w-4">:</div>
          <div>Permohonan Pembayaran</div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class="w-16">Hal</div>
          <div class="w-4">:</div>
          <div>
            <p class="m-0">
              Pengadaan DN <span>{{ formData.jenisPengadaan }}</span>
            </p>
          </div>
        </div>

        <!-- Kepada section -->
        <div class="mb-3 ml-[20mm]">
          <p class="m-0">Kepada</p>
          <p class="m-0">Yth. Pemimpin / Wakil Pemimpin</p>
          <p class="m-0">Perum BULOG Kantor Cabang Surakarta</p>
          <p class="m-0">Jl. LU. Adisucipto No. 17 Surakarta</p>
        </div>
        <!-- Dengan Hormat and PO details -->
        <div class="mb-2">
          <p class="m-0">Dengan Hormat,</p>
          <p class="m-0">
            Menunjuk kontrak Purchashing Order (PO) No
            <span class="underline">{{ formData.nomerPO }}</span> Tanggal
            <span class="underline">{{ tanggalFormatted.day }}</span> Bulan
            <span class="underline">{{ tanggalFormatted.month }}</span> Tahun
            <span class="underline">{{ tanggalFormatted.year }}</span>
          </p>
        </div>

        <!-- Kuantum information without dots -->
        <div class="mb-1">
          <div class="flex">
            <div class="w-[40%]">Kuantum</div>
            <div class="w-[2%]">:</div>
            <div class="flex-1">
              <div class="float-right">
                {{ calculateTotalKuantum(true) }} {{ formData.satuan }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb-1">
          <div class="flex">
            <div class="w-[40%]">Jumlah diajukan untuk pembayaran</div>
            <div class="w-[2%]">:</div>
            <div class="flex-1">
              <div class="float-right">
                {{
                  formData.jumlahPembayaran
                    ? formatRupiah(formData.jumlahPembayaran)
                    : 'Rp 0'
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="flex">
            <div class="w-[40%]">Telah di-SPP-kan</div>
            <div class="w-[2%]">:</div>
            <div class="flex-1">
              <div class="float-right">
                {{
                  formData.jumlahSPP ? formatRupiah(formData.jumlahSPP) : 'Rp 0'
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- Permohonan pembayaran section -->
        <div class="mb-1">
          <p class="m-0">
            Dengan ini kami mengajukan permohonan pembayaran pengadaan
            {{ formData.jenisPengadaan }} sesuai IN :
          </p>
        </div>

        <!-- Data entries without dotted lines and numbering -->
        <template v-if="formData.dataIN && formData.dataIN.length > 0">
          <div
            v-for="(item, index) in formData.dataIN"
            :key="index"
            class="mb-1"
          >
            <div class="flex">
              <div class="w-[10%]">No. {{ index + 1 }}</div>
              <div class="w-[25%]">Tgl {{ formatTanggal(item.tanggal) }}</div>
              <div class="w-[15%]">kuantum :</div>
              <div class="flex-1">
                <div class="float-right">
                  {{ item.kuantum }} {{ formData.satuan }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="mb-1">
            <div class="flex">
              <div class="w-[10%]">No. 1</div>
              <div class="w-[25%]">
                Tgl {{ formatTanggal(formData.tanggalPengadaan) }}
              </div>
              <div class="w-[15%]">kuantum :</div>
              <div class="flex-1">
                <div class="float-right">
                  {{ formData.kuantum }} {{ formData.satuan }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-1">
            <div class="flex">
              <div class="w-[10%]">No. 2</div>
              <div class="w-[25%]">
                Tgl {{ formatTanggal(formData.tanggalPengadaan) }}
              </div>
              <div class="w-[15%]">kuantum :</div>
              <div class="flex-1">
                <div class="float-right">0 {{ formData.satuan }}</div>
              </div>
            </div>
          </div>
          <div class="mb-1">
            <div class="flex">
              <div class="w-[10%]">No. 3</div>
              <div class="w-[25%]">
                Tgl {{ formatTanggal(formData.tanggalPengadaan) }}
              </div>
              <div class="w-[15%]">kuantum :</div>
              <div class="flex-1">
                <div class="float-right">0 {{ formData.satuan }}</div>
              </div>
            </div>
          </div>
        </template>
        <!-- Jumlah -->
        <div class="mb-5">
          <div class="flex">
            <div class="w-[10%]"></div>
            <div class="w-[25%]"></div>
            <div class="w-[15%]">Jumlah :</div>
            <div class="flex-1">
              <div class="float-right">
                {{ calculateTotalKuantum(true) }} {{ formData.satuan }}
              </div>
            </div>
          </div>
        </div>

        <!-- Terlampir section -->
        <div class="mb-1">
          <p class="m-0 underline">Terlampir :</p>
          <div class="flex gap-2">
            <div class="w-[25%]">PO</div>
            <div>: 1 set</div>
          </div>
          <div class="flex gap-2">
            <div class="w-[25%]">Dokumen IN</div>
            <div>: 1 set</div>
          </div>
          <div class="flex gap-2">
            <div class="w-[25%]">Sertifikat LHPK</div>
            <div>: 1 set</div>
          </div>
        </div>

        <div class="mb-5">
          <p class="m-0">
            Demikian atas terkabulnya permohonan tersebut diucapkan terima
            kasih.
          </p>
        </div>
        <!-- DISPOSISI section -->
        <div class="flex justify-between mt-4">
          <!-- Left side - DISPOSISI box -->
          <div class="w-[45%] border border-black p-2">
            <div class="text-center underline mb-2">DISPOSISI :</div>
            <p class="italic m-0">AM Administrasi dan Keuangan</p>
            <div class="ml-4 mt-2">
              <p class="m-0">
                - &nbsp;&nbsp;&nbsp; Dibayarkan Sesuai Ketentuan
              </p>
              <p class="m-0">- &nbsp;&nbsp;&nbsp; Tertib Administrasi</p>
            </div>
          </div>
          <!-- Right side - Pemohon -->
          <div class="w-[45%] text-center">
            <p class="mb-12">Pemohon</p>
            <p class="underline">{{ formData.namaPerusahaan }}</p>
            <p>({{ formData.namaSupplier }})</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    button {
      display: none !important;
    }
    .page {
      page-break-after: avoid;
      margin: 0;
      padding: 10mm 20mm;
    }
  }

  /* Tambahkan font-family Arial ke seluruh komponen */
  .font-arial {
    font-family: Arial, Helvetica, sans-serif;
  }

  /* Tambahkan font-family Times New Roman untuk judul */
  .font-times {
    font-family: 'Times New Roman', Times, serif !important;
  }

  /* Pastikan seluruh text menggunakan Arial kecuali yang diberikan class khusus */
  p,
  span {
    font-family: Arial, Helvetica, sans-serif !important;
  }

  /* Styling untuk border dotted dan underline */
  .border-dotted {
    border-style: dotted !important;
    border-bottom-width: 1px !important;
  }

  .underline {
    text-decoration: underline;
  }
</style>
