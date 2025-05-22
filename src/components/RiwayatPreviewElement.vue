<script setup>
  import Permohonan from '@/assets/images/misc/1.jpg'
  import PO from '@/assets/images/misc/2.jpg'
  import Kwitansi from '@/assets/images/misc/3.jpg'
</script>

<template>
  <section
    class="w-full h-[calc(100vh-270px)] pt-6 overflow-x-auto overflow-hidden"
  >
    <div class="w-full h-full flex gap-4 px-1 py-1">
      <img :src="Permohonan" class="outline" />
      <img :src="PO" class="outline" />
      <img :src="Kwitansi" class="outline w-100 h-80" />
    </div>
  </section>
</template>
