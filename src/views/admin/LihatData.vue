  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import LihatDataComponent from '@/components/LihatDataComponent.vue'
  import { usePengadaanStore } from '@/stores/pengadaanStore'
  import Swal from 'sweetalert2'

  const router = useRouter()
  const pengadaanStore = usePengadaanStore()

  // ✅ State untuk backend pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const pageInput = ref(1)
  const searchQuery = ref('')
  const selectedMonth = ref('')

  // ✅ Fetch data dengan backend pagination
  onMounted(async () => {
    await fetchData()
  })

  // ✅ Function untuk fetch data dengan parameter
  const fetchData = async () => {
    try {
      await pengadaanStore.fetchPengadaan(
        currentPage.value,
        itemsPerPage.value,
        searchQuery.value,
        selectedMonth.value,
      )
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // ✅ Data langsung dari store (sudah ter-paginasi dari backend)
  const tableData = computed(() => pengadaanStore.pengadaanList || [])
  const paginatedData = computed(() => {
    // ✅ Transform data untuk ditampilkan
    return tableData.value.map((item) => ({
      id: item.id,
      jenisPengadaan: item.jenis_pengadaan_barang,
      noProorder: item.no_preorder,
      supplier: item.nama_suplier,
      perusahaan: item.nama_perusahaan,
      kuantum: item.kuantum,
      tanggal: item.tanggal_pengadaan,
      rawData: item,
    }))
  })

  // ✅ Pagination info dari store
  const totalPages = computed(() => pengadaanStore.totalPages)
  const totalItems = computed(() => pengadaanStore.totalItems)

  const months = computed(() => [
    { value: '', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ])

  const displayedPageNumbers = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const delta = 2
    const range = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift('...')
    }
    if (current + delta < total - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (total > 1) {
      range.push(total)
    }

    return range.filter((item, index, arr) => arr.indexOf(item) === index)
  })

  // ✅ Watch untuk fetch data ketika ada perubahan
  watch([searchQuery, selectedMonth], () => {
    currentPage.value = 1
    pageInput.value = 1
    fetchData()
  })

  // ✅ Watch untuk fetch data ketika page berubah
  watch(currentPage, () => {
    pageInput.value = currentPage.value
    fetchData()
  })

  // ✅ Handlers
  const handlePageInput = () => {
    let page = pageInput.value
    if (page < 1) page = 1
    if (page > totalPages.value) page = totalPages.value
    currentPage.value = page
  }

  const handlePageChange = (page) => {
    currentPage.value = page
  }

  const handlePreview = (item) => {
    pengadaanStore.currentPengadaan = item.rawData
    router.push('/admin/previewpermohonan')
  }

  const handlePrint = (item) => {
    // Print logic here
  }

  const handleEdit = (item) => {
    router.push(`/admin/form-edit/${item.id}`)
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Hapus Data?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        await pengadaanStore.deletePengadaan(item.id)

        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus data',
          icon: 'error',
        })
      }
    }
  }
</script>

<template>
  <LihatDataComponent
    :tableData="tableData"
    :filteredData="paginatedData"
    :paginatedData="paginatedData"
    :searchQuery="searchQuery"
    :selectedMonth="selectedMonth"
    :currentPage="currentPage"
    :itemsPerPage="itemsPerPage"
    :pageInput="pageInput"
    :months="months"
    :getTotalPages="totalPages"
    :isExtraSmallScreen="false"
    :displayedPageNumbers="displayedPageNumbers"
    :userType="'admin'"
    @update:searchQuery="searchQuery = $event"
    @update:selectedMonth="selectedMonth = $event"
    @update:currentPage="handlePageChange"
    @update:pageInput="pageInput = $event"
    @page-input-submit="handlePageInput"
    @back="router.push('/admin/dashboard')"
    @preview="handlePreview"
    @print="handlePrint"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>
