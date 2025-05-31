<script setup>
  import { RouterLink, useRouter } from 'vue-router'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const router = useRouter()
  const printDocument = () => {
    window.print()
  }
</script>

<template>
  <tr
    class="border-b border-[#E4E7EC] cursor-pointer transition-all duration-200 ease-in-out"
  >
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
        <button
          @click="printDocument"
          class="cursor-pointer text-[#2B79EF] underline"
        >
          Cetak
        </button>

        <RouterLink :to="`/superadmin/riwayat-edit/${item.id}`">
          <button class="cursor-pointer text-[#9BA1AA] underline">Edit</button>
        </RouterLink>
        <button class="cursor-pointer text-[#F44336] underline">Delete</button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
  tr:hover {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
  }
</style>
