<script setup>
import { ref, computed, onMounted } from 'vue';

const formData = ref({
  namaSupplier: '',
  namaPerusahaan: '',
  jenisBank: '',
  nomerRekening: '',
  nomerPO: '',
  tanggalPengadaan: '',
  jenisPengadaan: '',
  kuantum: '',
  satuan: 'KG' // Add default satuan
});

// Load form data from localStorage on component mount
onMounted(() => {
  const savedData = localStorage.getItem('permohonanFormData');
  if (savedData) {
    formData.value = JSON.parse(savedData);
  }
  
  // Check if auto-print is requested
  const autoPrint = localStorage.getItem('autoPrint');
  if (autoPrint === 'true') {
    // Clear the auto-print flag
    localStorage.removeItem('autoPrint');
    
    // Give a small delay for the document to render properly before printing
    setTimeout(() => {
      printDocument();
    }, 500);
  }
});

// Format tanggalPengadaan into separate day, month, year
const tanggalFormatted = computed(() => {
  if (!formData.value.tanggalPengadaan) return { day: '', month: '', year: '' };
  
  const date = new Date(formData.value.tanggalPengadaan);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 
    'Mei', 'Juni', 'Juli', 'Agustus', 
    'September', 'Oktober', 'November', 'Desember'
  ];
  
  return {
    day: date.getDate().toString(),
    month: months[date.getMonth()],
    year: date.getFullYear().toString()
  };
});

// Get current date for the letter date
const currentDate = computed(() => {
  const today = new Date();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 
    'Mei', 'Juni', 'Juli', 'Agustus', 
    'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
});

// Function to print the document
const printDocument = () => {
  window.print();
};
</script>

<template>  <div class="flex flex-col items-center">
    <!-- Tombol Print yang hanya muncul di layar (tidak saat mencetak) -->
    <div class="w-full max-w-[210mm] py-4 px-12 mx-auto print:hidden">
      <div class="flex justify-between items-center">
        <button @click="$router.go(-1)" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
          Kembali
        </button>
        <button @click="printDocument" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors">
          Cetak Dokumen
        </button>
      </div>
    </div>
    
    <div class="flex justify-center">
      <div class="w-full max-w-[210mm] min-h-[297mm] p-10 px-12 mx-auto font-serif leading-normal text-black relative print:shadow-none">
        <div class="text-center mb-12">
          <h1 class="m-0 font-bold text-lg uppercase">SURAT PERMOHONAN PEMBAYARAN</h1>
          <h2 class="m-0 font-bold text-lg uppercase">PENGADAAN GABAH/BERAS DALAM NEGERI TAHUN 2025</h2>
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
            <span class="font-bold">{{ formData.namaSupplier }}</span> 
            menyampaikan permohonan pembayaran 
            <span class="font-bold">{{ formData.jenisPengadaan }}</span> 
            Pengadaan Dalam Negeri Tahun 2025 sebanyak 
            <span class="font-bold">{{ formData.kuantum }}</span> 
            <span class="font-bold">{{ formData.satuan }}</span> 
            dengan bukti dokumen terlampir.
          </p>
          
          <p class="mt-4 leading-loose mb-0">
            Mohon kiranya harga 
            <span class="font-bold">{{ formData.jenisPengadaan }}</span> 
            tersebut di atas dapat dibayar / dipindahbukukan ke rekening Kami Bank 
            <span class="font-bold">{{ formData.jenisBank }}</span> 
            sebagaimana No Rekening
            <span class="font-bold">{{ formData.nomerRekening }}</span> 
            Sesuai PO No 
            <span class="font-bold">{{ formData.nomerPO }}</span>
          </p>
          
          <p class="mt-4 leading-loose mb-0">
            Tanggal 
            <span class="font-bold">{{ tanggalFormatted.day }}</span> 
            Bulan 
            <span class="font-bold">{{ tanggalFormatted.month }}</span> 
            Tahun 
            <span class="font-bold">{{ tanggalFormatted.year }}</span>
          </p>
          
          <p class="mt-4 leading-loose mb-0">
            Demikian disampaikan dan atas perkenannya diucapkan terima kasih.
          </p>
        </div>
          
        <p class="text-right">Surakarta, <span class="font-bold">{{ currentDate }}</span></p>
        <p class="text-right">Pemohon</p>
        
        <div class="h-16"></div>
        
        <p class="text-right mt-10"><span class="font-bold">{{ formData.namaPerusahaan }}</span></p>
        <p class="text-right"><span class="font-bold">({{ formData.namaSupplier }})</span></p>
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
    display: none;
  }
}
</style>