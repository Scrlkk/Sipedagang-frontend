<script setup>
  import { ref } from 'vue'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import IndexElement from '@/components/IndexElement.vue'

  const data = ref([
    {
      title: '-',
      desc: '-',
    },
    {
      title: '-',
      desc: '-',
    },
    {
      title: '-',
      desc: '-',
    },
    {
      title: '-',
      desc: '-',
    },
  ])
</script>

<template>
  <SuperAdminLayout>
    <!-- TITLE -->
    <section>
      <div class="font-bold text-3xl text-[#575757] text-center py-16">
        Halo, Selamat Datang SuperAdmin
      </div>

      <!-- WIDGET -->
      <div class="grid grid-cols-2 gap-x-20 gap-y-14 px-29">
        <IndexElement v-for="(item, index) in data" :key="index" :item="item" />
      </div>
    </section>
  </SuperAdminLayout>
</template>
