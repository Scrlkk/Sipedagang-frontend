<script setup>
  import { RouterLink } from 'vue-router'
  import RiwayatPreviewElement from '@/components/RiwayatPreviewElement.vue'

  defineProps({
    item: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <tr class="border-b border-[#E4E7EC]">
    <td class="px-4 py-4">{{ item.jenisPengadaan }}</td>
    <td class="px-4 py-4">{{ item.noPreorder }}</td>
    <td class="px-4 py-4">{{ item.supplier }}</td>
    <td class="px-4 py-4">{{ item.perusahaan }}</td>
    <td class="px-4 py-4">{{ item.admin }}</td>
    <td class="px-4 py-4">{{ item.kuantum }}</td>
    <td class="px-4 py-4">{{ item.tanggal }}</td>
    <td class="px-4 py-3">
      <div
        class="flex flex-wrap space-x-4 gap-y-1 text-sm text-center underline-offset-3 justify-center items-center"
      >
        <RouterLink :to="`/superadmin/riwayat-preview/${item.id}`">
          <button class="cursor-pointer text-[#2B79EF] underline">
            Preview
          </button>
        </RouterLink>
        <RouterLink :to="`/superadmin/riwayat-edit/${item.id}`">
          <button class="cursor-pointer text-[#9BA1AA] underline">Edit</button>
        </RouterLink>
        <button class="cursor-pointer text-[#F44336] underline">Delete</button>
      </div>
    </td>
  </tr>
</template>
