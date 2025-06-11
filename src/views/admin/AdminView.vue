<script setup>
  import AdminLayout from '@/layouts/AdminLayout.vue'
  import { RouterLink } from 'vue-router'
  import { computed } from 'vue'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()

  const person = computed(() => ({
    nama:
      authStore.user?.name ||
      authStore.user?.nama ||
      authStore.user?.nama_pengguna ||
      'Admin',
  }))
</script>

<template>  <AdminLayout class="h-screen overflow-hidden">
    <transition name="page" appear>
      <div class="h-full flex flex-col py-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- Background Decorations -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 blur-3xl"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <!-- Content Container -->
        <div class="relative max-w-6xl mx-auto flex flex-col h-full justify-between">        
         <!-- Welcome Section -->
          <div class="text-center mb-4 flex-shrink-0">
            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 font-inter">
              Halo, Selamat Datang
              <span class="block sm:inline text-blue-600">{{ person.nama }}</span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Kelola data pengadaan dengan mudah
            </p>
          </div><!-- Dashboard Cards Grid -->
          <div class="flex-1 flex items-center justify-center min-h-0">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl">
              <!-- Form Input Data Card -->
              <RouterLink to="/admin/form" class="group block transform transition-all duration-300 hover:scale-[1.02]">
                <div class="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 h-48 sm:h-56 md:h-64">
                  <!-- Background Image -->
                  <div class="absolute inset-0">
                    <img
                      src="@/assets/images/input-data.png"
                      alt="Form Input Data"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <!-- Dark overlay -->
                    <div class="absolute inset-0 bg-black/40"></div>
                    <!-- Gradient overlay on hover -->
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>                  <!-- Content Overlay -->
                  <div class="relative h-full flex flex-col justify-center items-center text-center p-4">
                    <!-- Text Content -->
                    <div class="space-y-2">
                      <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white font-inter drop-shadow-lg">
                        Form Input Data
                      </h3>
                      <p class="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xs drop-shadow">
                        Input dan kelola data pengadaan baru
                      </p>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-3">
                      <div class="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full group-hover:bg-white/30 transition-colors duration-300 border border-white/30">
                        Mulai Input
                        <svg class="ml-1.5 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </RouterLink>              
              <!-- Lihat Data Card -->
              <RouterLink to="/admin/lihatdata" class="group block transform transition-all duration-300 hover:scale-[1.02]">
                <div class="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 h-48 sm:h-56 md:h-64">
                  <!-- Background Image -->
                  <div class="absolute inset-0">
                    <img
                      src="@/assets/images/rekap-data.png"
                      alt="Lihat Data"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <!-- Dark overlay -->
                    <div class="absolute inset-0 bg-black/40"></div>
                    <!-- Gradient overlay on hover -->
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>                  <!-- Content Overlay -->
                  <div class="relative h-full flex flex-col justify-center items-center text-center p-4">
                    <!-- Text Content -->
                    <div class="space-y-2">
                      <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white font-inter drop-shadow-lg">
                        Lihat Data
                      </h3>
                      <p class="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xs drop-shadow">
                        Lihat dan kelola data pengadaan
                      </p>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-3">
                      <div class="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full group-hover:bg-white/30 transition-colors duration-300 border border-white/30">
                        Lihat Data
                        <svg class="ml-1.5 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </RouterLink>

            </div>
          </div>

          <!-- Additional Info Section -->
          <div class="text-center flex-shrink-0 mt-4">
            <div class="inline-flex items-center space-x-2 text-xs text-gray-500">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <span>Sistem Informasi Pengadaan Barang • BULOG</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Card staggered animations */
.page-enter-active .grid > a:nth-child(1) {
  transition-delay: 0.1s;
}

.page-enter-active .grid > a:nth-child(2) {
  transition-delay: 0.2s;
}

/* Additional responsive utilities */
@media (max-width: 640px) {
  .grid {
    gap: 0.75rem;
  }
  
  .h-48 {
    height: 10rem;
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  .grid {
    gap: 1rem;
  }
  
  .sm\:h-56 {
    height: 12rem;
  }
}

@media (min-width: 768px) {
  .grid {
    gap: 1rem;
  }
  
  .md\:h-64 {
    height: 14rem;
  }
}

/* Ensure no overflow on any screen size */
@media (max-height: 600px) {
  .h-48 {
    height: 8rem !important;
  }
  
  .sm\:h-56 {
    height: 9rem !important;
  }
  
  .md\:h-64 {
    height: 10rem !important;
  }
}

@media (max-height: 500px) {
  .h-48 {
    height: 6rem !important;
  }
  
  .sm\:h-56 {
    height: 7rem !important;
  }
  
  .md\:h-64 {
    height: 8rem !important;
  }
}

/* Enhanced glassmorphism effects */
.bg-white\/95 {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Smooth transform animations */
.group:hover .group-hover\:scale-\[1\.02\] {
  transform: scale(1.02);
}

/* Better shadow transitions */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive text scaling */
@media (max-width: 390px) {
  h1 {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }
  
  h3 {
    font-size: 1.25rem !important;
    line-height: 1.75rem !important;
  }
  
  p {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }
}

/* Ultra-wide screen optimizations */
@media (min-width: 1536px) {
  .max-w-7xl {
    max-width: 80rem;
  }
  
  .max-w-5xl {
    max-width: 70rem;
  }
}

/* Touch improvements for mobile */
@media (hover: none) {
  .group:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

/* Focus states for accessibility */
.group:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 1.5rem;
}

/* Loading state animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
