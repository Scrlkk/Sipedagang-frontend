<script setup>
  import { RouterLink } from 'vue-router'

  defineProps({
    person: {
      type: Object,
      default: () => [],
    },
  })
</script>

<template>
  <div
    class="flex bg-[#F7F8FA] py-5 px-7 rounded-lg shadow-lg/25 flex-grow basis-[300px] max-w-[400px] h-[6.2rem]"
  >
    <div class="w-full flex items-center gap-4">
      <img
        :src="person.img"
        :alt="person.nama"
        loading="lazy"
        class="w-16 h-16 rounded-full"
      />
      <div class="flex flex-col justify-center">
        <div class="font-bold md:text-xl sm:text-sm">{{ person.nama }}</div>
        <p class="text-sm">{{ person.tempat }}</p>
      </div>
    </div>
    <div class="flex items-end -mr-1 -mb-1">
      <!-- SVG ICON -->
      <RouterLink :to="`/superadmin/staff-edit/${person.id}`">
        <svg
          width="26"
          height="25"
          viewBox="0 0 26 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.6089 4.79697L18.6402 3.76573C19.4946 2.91142 20.8797 2.91142 21.7339 3.76573C22.5882 4.62004 22.5882 6.00513 21.7339 6.85945L20.7027 7.89068M17.6089 4.79697L10.6722 11.7337C10.1435 12.2625 9.76847 12.9248 9.58714 13.6501L8.83301 16.6667L11.8496 15.9125C12.5749 15.7312 13.2372 15.3561 13.7659 14.8275L20.7027 7.89068M17.6089 4.79697L20.7027 7.89068"
            stroke="#575757"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M19.3458 13.0208C19.3458 16.4453 20.2916 19.1991 19.3458 20.3516C19.1727 20.5626 18.9793 20.756 18.7682 20.9291C17.6158 21.875 15.9035 21.875 12.4791 21.875H11.9583C8.02996 21.875 6.06579 21.875 4.84541 20.6546C3.62503 19.4343 3.625 17.47 3.625 13.5416V13.0208C3.625 9.59635 3.625 7.88414 4.57077 6.73169C4.74393 6.52071 4.9374 6.32724 5.14837 6.15408C6.30082 5.20831 8.01304 5.20831 11.4375 5.20831"
            stroke="#575757"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
