<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import { useAdminStore } from '@/stores/adminStore'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import IndexElement from '@/components/IndexElement.vue'

  const auth = useAuthStore()
  const adminStore = useAdminStore()

  const userName = computed(
    () => auth.user?.name || auth.user?.nama_pengguna || 'Admin',
  )

  const staffCount = computed(() => {
    const admins = adminStore.admins || []
    const activeCount = admins.filter(
      (admin) => admin.status === 'active' || !admin.status,
    ).length
    const inactiveCount = admins.filter(
      (admin) => admin.status === 'inactive',
    ).length

    return `${activeCount} Aktif, ${inactiveCount} Nonaktif`
  })

  const data = computed(() => [
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
      desc: staffCount.value,
    },
  ])

  onMounted(() => {
    adminStore.getAdmins('', '')
  })
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
