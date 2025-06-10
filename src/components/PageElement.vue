<script setup>
  import { computed, ref, watch } from 'vue'
  const props = defineProps({
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 1 },
  })
  const emit = defineEmits(['change'])

  function goToPage(page) {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      emit('change', page)
    }
  }

  const pageNumbers = computed(() => {
    const total = props.totalPages
    const current = props.currentPage
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 3) return [1, 2, 3, 4, 5]
    if (current >= total - 2)
      return [total - 4, total - 3, total - 2, total - 1, total]
    return [current - 2, current - 1, current, current + 1, current + 2]
  })

  // ✅ Computed untuk kondisi tombol prev/next
  const canGoPrevious = computed(() => props.currentPage > 1)
  const canGoNext = computed(() => props.currentPage < props.totalPages)

  // Untuk input manual page
  const inputPage = ref(props.currentPage)
  watch(
    () => props.currentPage,
    (val) => {
      inputPage.value = val
    },
  )

  function handleInputPage(e) {
    let page = parseInt(e.target.value)
    if (isNaN(page)) page = 1
    if (page < 1) page = 1
    if (page > props.totalPages) page = props.totalPages
    goToPage(page)
    e.target.value = '' // kosongkan input setelah submit
  }
</script>

<template>
  <section class="flex justify-center items-center gap-2">
    <!-- ✅ Prev Button dengan kondisi styling -->
    <button
      :class="[
        'font-poppins rounded-sm w-8 h-8 transition-all duration-200',
        canGoPrevious
          ? 'border border-[#CED4DA] hover:bg-[#0099FF] hover:border-[#0099FF] hover:text-white text-[#333] cursor-pointer'
          : 'bg-[#EAE9EF] text-[#ADB5BD] cursor-not-allowed border border-[#EAE9EF]',
      ]"
      :disabled="!canGoPrevious"
      @click="canGoPrevious && goToPage(props.currentPage - 1)"
    >
      &lt;
    </button>

    <!-- Page Numbers -->
    <div
      v-for="page in pageNumbers"
      :key="page"
      :class="[
        'font-medium border border-[#CED4DA] text-sm rounded-sm w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-200',
        page === props.currentPage
          ? 'bg-[#0099FF] text-white border-[#0099FF]'
          : 'hover:border-[#0099FF] hover:text-[#0099FF] text-[#333]',
      ]"
      @click="goToPage(page)"
    >
      {{ page }}
    </div>

    <!-- ✅ Next Button dengan kondisi styling -->
    <button
      :class="[
        'font-poppins rounded-sm w-8 h-8 transition-all duration-200',
        canGoNext
          ? 'border border-[#CED4DA] hover:bg-[#0099FF] hover:border-[#0099FF] hover:text-white text-[#333] cursor-pointer'
          : 'bg-[#EAE9EF] text-[#ADB5BD] cursor-not-allowed border border-[#EAE9EF]',
      ]"
      :disabled="!canGoNext"
      @click="canGoNext && goToPage(props.currentPage + 1)"
    >
      &gt;
    </button>

    <!-- SEARCH PAGE -->
    <div class="flex text-sm gap-3 items-center ml-2">
      <input
        type="number"
        min="1"
        :max="props.totalPages"
        :placeholder="props.currentPage.toString()"
        :value="''"
        @change="handleInputPage"
        @keyup.enter="handleInputPage"
        class="border border-[#CED4DA] rounded-sm w-16 h-8 px-2 text-center focus:outline-[#0099FF] focus:text-[#0099FF] focus:border-[#0099FF] transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div class="text-[#6C757D]">/Page</div>
    </div>
  </section>
</template>
