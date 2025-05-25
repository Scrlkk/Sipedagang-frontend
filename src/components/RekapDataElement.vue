<script setup>
  defineProps({
    rekap: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <tr
    class="border-b border-[#E4E7EC] hover:bg-[#E4E7EC] text-gray-700 text-sm text-center"
  >
    <td class="py-4">{{ rekap.kode }}</td>
    <td class="py-4">{{ rekap.nama }}</td>
    <td class="py-4">{{ rekap.tanggal }}</td>
    <td class="py-4">{{ rekap.waktu }}</td>
    <td class="py-3 text-sm text-center justify-center items-center">
      <button
        class="text-white py-1.5 px-5.5 rounded-xl bg-[#4CAF50] hover:scale-95 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
      >
        Export
      </button>
    </td>
  </tr>
</template>
