<script setup>
  import { RouterLink, useRouter } from 'vue-router'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import { computed } from 'vue'
  import Swal from 'sweetalert2'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const pengadaanStore = usePengadaanStore()

  const openPrintPreview = () => {
    window.open(`/surat-preview/${props.item.id}`, '_blank')
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        await pengadaanStore.deletePengadaan(props.item.id)

        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Terjadi kesalahan saat menghapus data',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
      }
    }
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // Helper function to convert to proper Title Case
  const toTitleCase = (str) => {
    if (!str) return '-'
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // ✅ MODIFIED: Hanya jenis pengadaan yang menggunakan Title Case
  const jenisPengadaanFormatted = computed(() => {
    const str =
      props.item.jenis_pengadaan_barang || props.item.jenisPengadaan || ''
    return toTitleCase(str)
  })

  // ✅ MODIFIED: Supplier tanpa Title Case - tampilkan original
  const supplierFormatted = computed(() => {
    const str = props.item.nama_suplier || props.item.supplier || ''
    return str || '-'
  })

  // ✅ MODIFIED: Perusahaan tanpa Title Case - tampilkan original
  const perusahaanFormatted = computed(() => {
    const str = props.item.nama_perusahaan || props.item.perusahaan || ''
    return str || '-'
  })

  const userFormatted = computed(() => {
    const str = props.item.user?.name || ''
    if (!str) return 'Unknown'
    return toTitleCase(str)
  })
</script>

<template>
  <tr class="border-b border-[#E4E7EC] cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50">
    <!-- Jenis Pengadaan -->
    <td class="px-2 sm:px-3 xl:px-4 py-2 sm:py-3 xl:py-4 text-left">
      <div
        class="max-w-[80px] sm:max-w-[120px] xl:max-w-[200px] truncate text-xs sm:text-sm"
        :title="jenisPengadaanFormatted"
      >
        {{ jenisPengadaanFormatted }}
      </div>
    </td>
    <!-- No Preorder -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[70px] sm:max-w-[100px] xl:max-w-[150px] truncate text-xs sm:text-sm"
        :title="item.no_preorder || item.noPreorder || '-'"
      >
        {{ item.no_preorder || item.noPreorder || '-' }}
      </div>
    </td>
    <!-- Supplier -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[70px] sm:max-w-[100px] xl:max-w-[150px] truncate text-xs sm:text-sm"
        :title="supplierFormatted"
      >
        {{ supplierFormatted }}
      </div>
    </td>
    <!-- Perusahaan -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[70px] sm:max-w-[100px] xl:max-w-[150px] truncate text-xs sm:text-sm"
        :title="perusahaanFormatted"
      >
        {{ perusahaanFormatted }}
      </div>
    </td>
    <!-- Admin/User -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[60px] sm:max-w-[80px] xl:max-w-[120px] truncate text-xs sm:text-sm"
        :title="userFormatted"
      >
        {{ userFormatted }}
      </div>
    </td>
    <!-- Kuantum -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[50px] sm:max-w-[60px] xl:max-w-[80px] truncate text-xs sm:text-sm"
        :title="item.kuantum || '-'"
      >
        {{ item.kuantum || '-' }}
      </div>
    </td>
    <!-- Tanggal -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3 xl:py-4">
      <div
        class="max-w-[60px] sm:max-w-[80px] xl:max-w-[100px] truncate text-xs sm:text-sm"
        :title="formatDate(item.tanggal_pengadaan || item.tanggal)"
      >
        {{ formatDate(item.tanggal_pengadaan || item.tanggal) }}
      </div>
    </td>
    <!-- Action Buttons -->
    <td class="px-1 sm:px-2 xl:px-4 py-2 sm:py-3">
      <div class="flex space-x-0.5 sm:space-x-1 xl:space-x-2 justify-center items-center">
        <!-- Print Button -->
        <button
          @click="openPrintPreview"
          class="cursor-pointer text-[#2B79EF] hover:text-[#1E5FCC] transition-all duration-200 p-1 sm:p-1.5 xl:p-2 rounded-full hover:bg-blue-50"
          title="Cetak Dokumen"
        >
          <svg
            width="12"
            height="12"
            class="sm:w-[14px] sm:h-[14px] xl:w-[18px] xl:h-[18px]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
          </svg>
        </button>

        <!-- Edit Button -->
        <RouterLink :to="`/superadmin/riwayat-edit/${item.id}`">
          <button
            class="cursor-pointer text-[#9BA1AA] hover:text-[#6B7280] transition-all duration-200 p-1 sm:p-1.5 xl:p-2 rounded-full hover:bg-gray-50"
            title="Edit Data"
          >
            <svg
              width="12"
              height="12"
              class="sm:w-[14px] sm:h-[14px] xl:w-[18px] xl:h-[18px]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </RouterLink>

        <!-- Delete Button -->
        <button
          @click="handleDelete"
          class="cursor-pointer text-[#F44336] hover:text-[#D32F2F] transition-all duration-200 p-1 sm:p-1.5 xl:p-2 rounded-full hover:bg-red-50"
          title="Hapus Data"
        >
          <svg
            width="12"
            height="12"
            class="sm:w-[14px] sm:h-[14px] xl:w-[18px] xl:h-[18px]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
  tr:hover {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
  }
</style>
