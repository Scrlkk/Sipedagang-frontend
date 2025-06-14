<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import IndexElement from '@/components/IndexElement.vue'

  const auth = useAuthStore()
  const userName = computed(
    () => auth.user?.name || auth.user?.nama_pengguna || 'Admin',
  )

  // Unified time system for both greeting and clock
  const currentTime = ref(new Date())

  const timeBasedGreeting = computed(() => {
    const hour = currentTime.value.getHours()
    const clock = currentTime.value
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\./g, ':')

    let greeting = ''
    if (hour < 12) greeting = 'Selamat Pagi'
    else if (hour < 16) greeting = 'Selamat Siang'
    else if (hour < 18) greeting = 'Selamat Sore'
    else greeting = 'Selamat Malam'

    return {
      greeting,
      clock,
    }
  })

  // Current month computed property
  const currentMonth = computed(() => {
    return currentTime.value.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
  })

  // Update time every second for synchronized greeting and clock
  onMounted(() => {
    setInterval(() => {
      currentTime.value = new Date()
    }, 1000)
  })

  const data = ref([
    {
      title: 'Total Stock Gudang',
      desc: '-',
    },
    {
      title: 'Total Anggaran',
      desc: '-',
    },
    {
      title: 'Total Anggaran Gudang',
      desc: '-',
    },
    {
      title: 'Admin',
      desc: '-',
    },
  ])
</script>

<template>
  <SuperAdminLayout>
    <div
      class="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"
    >
      <!-- Hero Section with Enhanced Welcome -->
      <div
        class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"
      >
        <!-- Animated Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse transform -translate-x-16 -translate-y-16 sm:-translate-x-24 sm:-translate-y-24 lg:-translate-x-36 lg:-translate-y-36"
          ></div>
          <div
            class="absolute top-16 right-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 transform translate-x-12 sm:translate-x-16 lg:translate-x-24"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 transform translate-x-24 translate-y-24 sm:translate-x-32 sm:translate-y-32 lg:translate-x-48 lg:translate-y-48"
          ></div>
        </div>

        <!-- Geometric Decorations -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute top-10 left-10 sm:top-20 sm:left-20 w-2 h-2 sm:w-4 sm:h-4 bg-white/20 rounded-full"
          ></div>
          <div
            class="absolute top-20 left-20 sm:top-40 sm:left-40 w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full"
          ></div>
          <div
            class="absolute top-30 right-30 sm:top-60 sm:right-60 w-2 h-2 sm:w-3 sm:h-3 bg-white/25 rounded-full"
          ></div>
          <div
            class="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-3 h-3 sm:w-6 sm:h-6 bg-white/15 rounded-full"
          ></div>
        </div>

        <div
          class="relative px-3 sm:px-4 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 xl:py-20"
        >
          <div class="max-w-7xl mx-auto text-center">
            <!-- Welcome Content -->
            <div class="space-y-3 sm:space-y-4">
              <div
                class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6"
              >
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse"
                ></div>
                <span class="text-white/90 text-xs sm:text-sm font-medium"
                  >Dashboard Active</span
                >
              </div>

              <h1
                class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2"
              >
                {{ timeBasedGreeting.greeting }}, {{ userName }}!
                <span class="inline-block animate-bounce">👋</span>
              </h1>

              <p
                class="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed px-2"
              >
                <span
                  class="font-mono font-semibold text-white text-sm sm:text-base md:text-lg lg:text-xl"
                  >{{ timeBasedGreeting.clock }}</span
                >
              </p>

              <div
                class="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 mt-6 sm:mt-8 text-blue-100 px-2"
              >
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-xs sm:text-sm">Sistem Aktif</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-xs sm:text-sm">{{
                    new Date().toLocaleDateString('id-ID')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="relative px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        <div class="max-w-7xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-8 sm:mb-12">
            <!-- Icon and Title -->
            <div class="flex justify-center mb-4 sm:mb-6">
              <div
                class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
              >
                <svg
                  class="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Title -->
            <h2
              class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
            >
              Ringkasan Dashboard
            </h2>

            <!-- Description -->
            <p
              class="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8"
            >
              Overview data utama sistem pengadaan untuk monitoring dan analisis
              performa
            </p>

            <!-- Period Filter -->
            <div
              class="flex items-center justify-center space-x-3 sm:space-x-4"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-sm text-gray-600 font-medium">Periode:</span>
              </div>
              <div
                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg border border-blue-300/20 backdrop-blur-sm"
              >
                {{ currentMonth }}
              </div>
            </div>
          </div>

          <!-- Enhanced Stats Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 px-2 sm:px-0"
          >
            <IndexElement
              v-for="(item, index) in data"
              :key="index"
              :item="item"
            />
          </div>

          <!-- Additional Info Section -->
          <div class="mt-12 sm:mt-16 text-center px-2">
            <div
              class="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl"
            >
              <div class="flex items-center justify-center mb-3 sm:mb-4">
                <div class="flex -space-x-1 sm:-space-x-2">
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h3
                class="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2"
              >
                Super Admin
              </h3>
              <p class="text-gray-600 text-sm sm:text-base">
                Mengelola sistem pengadaan secara efisien
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
</template>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Additional responsive utilities */
  @media (max-width: 640px) {
    .max-w-7xl {
      max-width: 100%;
    }
  }

  @media (min-width: 640px) and (max-width: 768px) {
    .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
