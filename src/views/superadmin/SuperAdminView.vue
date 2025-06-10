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
      <div class="font-bold text-3xl text-[#575757] text-center py-16">
        Halo, Selamat Datang {{ userName }}
      </div>

      <!-- WIDGET -->
      <div class="grid grid-cols-2 gap-x-20 gap-y-14 px-29">
        <IndexElement v-for="(item, index) in data" :key="index" :item="item" />
      </div>
    </section>
  </SuperAdminLayout>
</template>
