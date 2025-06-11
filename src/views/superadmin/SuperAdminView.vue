<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import IndexElement from '@/components/IndexElement.vue'

  const auth = useAuthStore()
  const userName = computed(
    () => auth.user?.name || auth.user?.nama_pengguna || 'Admin',
  )

  // Add time-based greeting
  const currentTime = ref(new Date())
  const greeting = computed(() => {
    const hour = currentTime.value.getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 16) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  })

  // Update time every minute
  onMounted(() => {
    setInterval(() => {
      currentTime.value = new Date()
    }, 60000)
  })

  const data = ref([
    {
      title: 'Total Pengadaan',
      desc: '-',
    },
    {
      title: 'Total Anggaran',
      desc: '-',
    },
    {
      title: 'Kontrak Aktif',
      desc: '-',
    },
    {
      title: 'Staff',
      desc: '-',
    },
  ])
</script>

<template>
  <SuperAdminLayout>
    <div class="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <!-- Hero Section with Enhanced Welcome -->
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <!-- Animated Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse transform -translate-x-36 -translate-y-36"></div>
          <div class="absolute top-32 right-20 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 transform translate-x-24"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 transform translate-x-48 translate-y-48"></div>
        </div>

        <!-- Geometric Decorations -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full"></div>
          <div class="absolute top-40 left-40 w-2 h-2 bg-white/30 rounded-full"></div>
          <div class="absolute top-60 right-60 w-3 h-3 bg-white/25 rounded-full"></div>
          <div class="absolute bottom-20 right-20 w-6 h-6 bg-white/15 rounded-full"></div>
        </div>

        <div class="relative px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div class="max-w-7xl mx-auto text-center">
            <!-- Welcome Content -->
            <div class="space-y-4">
              <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span class="text-white/90 text-sm font-medium">Dashboard Active</span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {{ greeting }}, {{ userName }}! 
                <span class="inline-block animate-bounce">👋</span>
              </h1>
              
              <p class="text-xl sm:text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed">
                Selamat datang kembali di <span class="font-semibold text-white">Dashboard Super Admin</span>
              </p>
              
              <div class="flex items-center justify-center space-x-6 mt-8 text-blue-100">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm">Sistem Aktif</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm">{{ new Date().toLocaleDateString('id-ID') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="relative px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div class="max-w-7xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Ringkasan Dashboard
            </h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Overview data utama sistem pengadaan untuk monitoring dan analisis performa
            </p>
          </div>

          <!-- Enhanced Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            <IndexElement v-for="(item, index) in data" :key="index" :item="item" />
          </div>

          <!-- Additional Info Section -->
          <div class="mt-16 text-center">
            <div class="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
              <div class="flex items-center justify-center mb-4">
                <div class="flex -space-x-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Super Admin</h3>
              <p class="text-gray-600">Mengelola sistem pengadaan secara efisien</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
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
</style>
