<script setup>
  defineProps({
    datain: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <div class="pt-1">
    <div class="grid grid-cols-2 w-[89%]">
      <div class="grid grid-cols-3">
        <div>No. {{ datain.no_in }}</div>
        <div class="col-span-2">
          Tgl <span class="ml-2">{{ datain.tanggal_in }}</span>
        </div>
      </div>
      <div>Kuantum : {{ datain.kuantum_in }}</div>
    </div>
  </div>
</template>
