<script setup>
  const props = defineProps({
    color: { type: String, default: '#9BA1AA' },
    stroke: { type: String, default: 'white' },
  })
</script>

<template>
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Background rounded rectangle -->
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="3"
      :fill="color"
    />
    <!-- Form document icon -->
    <path
      d="M7 6H17M7 9H17M7 12H13M7 15H11"
      :stroke="stroke"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Form fields/lines -->
    <rect
      x="15.5"
      y="14.5"
      width="2"
      height="2"
      rx="0.5"
      :fill="stroke"
    />
    <rect
      x="15.5"
      y="17.5"
      width="2"
      height="2"
      rx="0.5"
      :fill="stroke"
    />
  </svg>
</template>
