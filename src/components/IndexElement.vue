<script setup>
  defineProps({
    item: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <section
    class="relative flex flex-col p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl h-40 sm:h-44 lg:h-48 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-blue-100/50 overflow-hidden group"
  >
    <!-- Background decoration -->
    <div
      class="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/10 to-blue-600/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 group-hover:scale-110 transition-transform duration-500"
    ></div>

    <!-- Content with better layout structure -->
    <div class="relative z-10 flex flex-col justify-between h-full">
      <!-- Title and description section -->
      <div class="flex-1 min-h-0">
        <!-- Title with fixed height container -->
        <div class="h-12 sm:h-14 lg:h-16 mb-2 sm:mb-3 flex items-start">
          <h3
            class="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2"
          >
            {{ item.title }}
          </h3>
        </div>

        <!-- Description with fixed height -->
        <div class="h-8 sm:h-10 lg:h-12 flex items-center">
          <p
            class="text-slate-500 text-xs sm:text-sm lg:text-base font-medium leading-relaxed line-clamp-2"
          >
            {{ item.desc }}
          </p>
        </div>
      </div>

      <!-- Icon container always at bottom -->
      <div class="flex justify-end items-end mt-2 sm:mt-3">
        <div
          class="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
        >
          <!-- Simple Chart SVG -->
          <svg
            width="50"
            height="20"
            viewBox="0 0 50 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="sm:w-[60px] sm:h-[24px] lg:w-[70px] lg:h-[28px] group-hover:scale-105 transition-transform duration-300"
          >
            <!-- Simple bars -->
            <rect
              x="2"
              y="12"
              width="3"
              height="6"
              rx="1.5"
              fill="white"
              opacity="0.7"
            />
            <rect
              x="8"
              y="8"
              width="3"
              height="10"
              rx="1.5"
              fill="white"
              opacity="0.8"
            />
            <rect
              x="14"
              y="4"
              width="3"
              height="14"
              rx="1.5"
              fill="white"
              opacity="1"
            />
            <rect
              x="20"
              y="10"
              width="3"
              height="8"
              rx="1.5"
              fill="white"
              opacity="0.8"
            />
            <rect
              x="26"
              y="6"
              width="3"
              height="12"
              rx="1.5"
              fill="white"
              opacity="0.9"
            />
            <rect
              x="32"
              y="14"
              width="3"
              height="4"
              rx="1.5"
              fill="white"
              opacity="0.6"
            />
            <rect
              x="38"
              y="9"
              width="3"
              height="9"
              rx="1.5"
              fill="white"
              opacity="0.8"
            />
            <rect
              x="44"
              y="11"
              width="3"
              height="7"
              rx="1.5"
              fill="white"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
