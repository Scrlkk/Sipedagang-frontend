<script setup>
  import { ref,computed } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import IndexElement from '@/components/IndexElement.vue'

  const auth = useAuthStore()
  const userName = computed(
    () => auth.user?.name || auth.user?.nama_pengguna || 'Admin',
  )

  const data = ref([
    {
      title: 'Total Pengadaan',
      desc: '-',
    },
    {
      title: 'Total Anggaran',
      desc: '-',
    },
    {
      title: 'Kontrak Aktif',
      desc: '-',
    },
    {
      title: 'Staff',
      desc: '-',
    },
  ])
</script>

<template>
  <SuperAdminLayout>
    <!-- TITLE -->
    <section class="w-full h-full">
      <div class="font-bold text-xl sm:text-2xl lg:text-3xl text-[#575757] text-center py-8 sm:py-12 lg:py-16 px-4">
        Halo, Selamat Datang {{ userName }}
      </div>

      <!-- WIDGET -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-20 lg:gap-y-14 px-4 sm:px-8 lg:px-29 pb-8">
        <IndexElement v-for="(item, index) in data" :key="index" :item="item" />
      </div>
    </section>
  </SuperAdminLayout>
</template>
