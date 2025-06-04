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
        <div>No. {{ datain.no }}</div>
        <div class="col-span-2">
          Tgl <span class="ml-2">{{ datain.tgl }}</span>
        </div>
      </div>
      <div>kuantum : {{ datain.kuantum }} KG</div>
    </div>
  </div>
</template>
