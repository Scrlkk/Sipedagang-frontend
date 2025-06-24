<script setup>
  import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useUserStore } from '@/stores/userStore' // ✅ TAMBAH: Import userStore
  import { config } from '@/config/env'

  const router = useRouter()
  const auth = useAuthStore()
  const userStore = useUserStore() // ✅ TAMBAH: Initialize userStore

  // ✅ TAMBAH: State untuk animasi refresh
  const isRefreshing = ref(false)
  const profileUpdateTrigger = ref(0) // Trigger untuk force re-render

  // User info dari auth store dengan reactive update
  const userName = computed(() => {
    // Force reactivity dengan trigger
    profileUpdateTrigger.value
    return auth.user?.name || auth.user?.nama_pengguna || 'Admin'
  })

  // ✅ Computed untuk role/jabatan pengguna dengan reactive update
  const userRole = computed(() => {
    // Force reactivity dengan trigger
    profileUpdateTrigger.value
    // Cek role dari berbagai kemungkinan field
    return auth.user?.role || 
           auth.user?.jabatan || 
           auth.user?.level || 
           'Administrator'
  })

  // ✅ UBAH: Gunakan reactive profile photo dengan animasi
  const profilePhoto = computed(() => {
    // Force reactivity dengan trigger
    profileUpdateTrigger.value
    
    const foto =
      auth.user?.profile_photo ||
      auth.user?.foto ||
      auth.user?.img ||
      auth.user?.gambar ||
      auth.user?.photo

    if (foto) {
      return config.getStorageUrl(foto)
    }

    // Fallback ke UI-Avatars seperti komponen lainnya
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || auth.user?.nama_pengguna || 'Admin')}&background=0099FF&color=fff&size=128`
  })

  // ✅ TAMBAH: Function untuk refresh profile dengan animasi
  const refreshProfile = async () => {
    try {
      isRefreshing.value = true
      
      // Delay untuk animasi loading
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Fetch user data terbaru dari userStore
      const updatedUser = await userStore.fetchCurrentUser()
      
      if (updatedUser) {
        // Update auth store dengan data terbaru
        auth.user = { ...auth.user, ...updatedUser }
        
        // Trigger reactivity
        profileUpdateTrigger.value++
        
        console.log('✅ AdminLayout: Profile refreshed successfully')
      }
      
    } catch (error) {
      console.error('❌ AdminLayout: Error refreshing profile:', error)
    } finally {
      // Delay untuk animasi selesai
      setTimeout(() => {
        isRefreshing.value = false
      }, 500)
    }
  }

  // ✅ TAMBAH: Watch untuk sessionStorage changes
  const checkProfileUpdate = () => {
    const isProfileUpdated = sessionStorage.getItem('profileUpdated')
    const isProfileUpdating = sessionStorage.getItem('profileUpdating')
    
    if (isProfileUpdated === 'true' && isProfileUpdating === 'true') {
      console.log('🔄 AdminLayout: Profile update detected, refreshing...')
      
      // Clear flags
      sessionStorage.removeItem('profileUpdated')
      sessionStorage.removeItem('profileUpdating')
      
      // Refresh profile dengan delay untuk smooth transition
      setTimeout(() => {
        refreshProfile()
      }, 100)
    }
  }

  // ✅ TAMBAH: Watch untuk route changes
  watch(() => router.currentRoute.value, () => {
    nextTick(() => {
      checkProfileUpdate()
    })
  })

  // Track dropdown visibility
  const isProfileDropdownOpen = ref(false)

  // ✅ PERBAIKI: Ganti isProfileDropdown dengan isProfileDropdownOpen
  const toggleProfileDropdown = () => {
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value
  }

  // Close dropdown when clicking outside
  const closeDropdown = (event) => {
    const profileElement = document.getElementById('profile-dropdown-container')
    if (profileElement && !profileElement.contains(event.target)) {
      isProfileDropdownOpen.value = false
    }
  }

  // ✅ Update fungsi logout untuk mengirim API logout
  const handleLogout = async () => {
    try {
      // Tutup dropdown terlebih dahulu
      isProfileDropdownOpen.value = false

      // Panggil API logout melalui authStore
      await auth.logout()

      // Redirect ke login
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if API call fails
      auth.clearAuth()
      router.push('/login')
    }
  }

  // Add and remove event listeners for clicking outside
  onMounted(() => {
    document.addEventListener('click', closeDropdown)
    
    // ✅ TAMBAH: Check for profile update on mount
    checkProfileUpdate()
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
  })

  // Add the edit profile handler
  const handleEditProfile = () => {
    // Close dropdown first
    isProfileDropdownOpen.value = false
    
    // Navigate to edit profile page
    router.push('/admin/editprofile') // Adjust route as needed
  }
</script>

<template>
  <div class="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Top SVG Wave -->
    <div class="absolute top-0 left-0 right-0 z-0">
      <svg
        width="100%"
        height="120"
        preserveAspectRatio="none"
        viewBox="0 0 1514 173"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="sm:h-[140px] md:h-[160px] lg:h-[173px] transition-all duration-300"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1514 142.27V173C1489.62 160.399 1440.3 100.191 1143.36 104.5C1019.81 104.5 997.051 54 868.084 48.5C744.537 44.679 620.989 71.4258 497.442 48.5C373.894 25.5742 63.9413 5.12171 0 0H93.2025C154.976 0 278.524 0 402.072 0C525.619 0 649.167 0 772.714 0C896.262 0 1019.81 0 1143.36 0C1266.9 0 1390.45 0 1452.23 0H1514V142.27Z"
          fill="url(#gradient-top)"
        />
        <defs>
          <linearGradient id="gradient-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #0099ff; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #176bc7; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #1e40af; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <!-- Bottom Left SVG Wave -->
    <div class="absolute bottom-0 left-0 z-0 w-1/2 sm:w-1/3 md:w-auto">
      <svg
        width="100%"
        height="60"
        preserveAspectRatio="none"
        viewBox="0 0 548 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="sm:h-[80px] md:h-[90px] lg:h-[105px] transition-all duration-300"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M548 105.271H499.5C476.5 108.5 434.546 88.9172 391.092 86.1614C347.637 83.6812 304.182 73.5796 260.728 57.596C217.273 41.8881 173.818 9.92093 130.364 2.20472C86.9092 -5.78706 43.4546 9.92093 21.7273 17.9127L0 25.9045V105.271H21.7273C43.4546 105.271 86.9092 105.271 130.364 105.271C173.818 105.271 217.273 105.271 260.728 105.271C304.182 105.271 347.637 105.271 391.092 105.271C434.546 105.271 478 104.776 499.5 105.271H521.455H548Z"
          fill="url(#gradient-bottom-left)"
        />
        <defs>
          <linearGradient
            id="gradient-bottom-left"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style="stop-color: #f0ab26; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #f59e0b; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Bottom Right SVG Wave -->
    <div class="absolute bottom-0 right-0 z-0 w-2/3 md:w-auto">
      <svg
        width="100%"
        height="90"
        preserveAspectRatio="none"
        viewBox="0 0 1051 157"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="sm:h-[120px] md:h-[140px] lg:h-[157px] transition-all duration-300"
      >
        <path
          d="M1051 157H0.602539C29.1097 153.456 59.8947 149.303 90.6797 144.537C170.706 132.148 250.733 115.63 330.76 103.241C410.786 90.8523 490.813 82.5923 570.84 90.8516C650.866 99.1108 730.893 123.889 810.92 111.5C890.947 99.1111 970.973 49.5551 1010.99 24.7773L1051 0V157Z"
          fill="url(#gradient-bottom-right)"
        />
        <defs>
          <linearGradient
            id="gradient-bottom-right"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style="stop-color: #1b4f88; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #1e3a8a; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <!-- Header -->
    <header>
      <div
        class="flex flex-row justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 lg:py-6"
      >
        <!-- Logo -->
        <div
          class="flex text-[18px] xs:text-[22px] sm:text-[28px] md:text-[32px] lg:text-[40px] xl:text-[48px] font-bold font-poppins drop-shadow-sm"
        >
          <div class="text-[#F0AB26] transition-colors duration-300">Si</div>
          <div class="text-[#176BC7] transition-colors duration-300">
            PEDAGANG
          </div>
        </div>
        
        <!-- User Profile -->
        <div class="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <!-- User Avatar and Name with Dropdown -->
          <div id="profile-dropdown-container" class="relative z-[10000]">
            <div
              @click="toggleProfileDropdown"
              class="flex items-center gap-2 sm:gap-3 cursor-pointer transition-all hover:opacity-90 p-1 sm:p-2 rounded-lg hover:bg-white/10 relative z-[9999] border border-white/20 bg-white/5"
            >
              <!-- ✅ UBAH: Avatar dengan animasi refresh -->
              <div
                class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/30 relative"
                :class="{ 'animate-pulse': isRefreshing }"
              >
                <!-- ✅ TAMBAH: Loading overlay saat refresh -->
                <div
                  v-if="isRefreshing"
                  class="absolute inset-0 bg-white/30 flex items-center justify-center z-10 backdrop-blur-sm rounded-full"
                >
                  <svg
                    class="w-4 h-4 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                
                <!-- ✅ UBAH: Image dengan transition -->
                <Transition
                  name="profile-image"
                  mode="out-in"
                  enter-active-class="transition-all duration-500 ease-out"
                  leave-active-class="transition-all duration-300 ease-in"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <img
                    :key="profilePhoto" 
                    :src="profilePhoto"
                    :alt="userName"
                    class="w-full h-full object-cover transition-all duration-300"
                    @error="
                      (e) => {
                        // Fallback ke UI-Avatars jika gambar gagal dimuat
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0099FF&color=fff&size=128`
                      }
                    "
                  />
                </Transition>
              </div>
              
              <!-- ✅ UBAH: Username dengan transition -->
              <Transition
                name="profile-text"
                mode="out-in"
                enter-active-class="transition-all duration-500 ease-out"
                leave-active-class="transition-all duration-300 ease-in"
                enter-from-class="opacity-0 translate-x-2"
                enter-to-class="opacity-100 translate-x-0"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-2"
              >
                <div
                  :key="userName"
                  class="text-white text-[11px] sm:text-[13px] lg:text-[14px] xl:text-[15px] font-medium font-poppins hidden xs:block profile-text-adaptive truncate max-w-[120px] sm:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px]"
                  :title="userName"
                  :class="{ 'opacity-50': isRefreshing }"
                >
                  {{ userName }}
                </div>
              </Transition>
              
              <!-- Dropdown Arrow -->
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 hidden sm:block"
                :class="{ 'rotate-180': isProfileDropdownOpen, 'opacity-50': isRefreshing }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
            
            <!-- Animated Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isProfileDropdownOpen"
                class="absolute right-0 mt-3 w-52 sm:w-56 bg-white/98 rounded-2xl shadow-2xl py-3 z-[10001] origin-top-right border border-gray-200/50 ring-1 ring-black/5 overflow-hidden"
              >
                <!-- Profile Info Section (Mobile Only) -->
                <div class="px-4 py-3 border-b border-gray-100 sm:hidden">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative"
                      :class="{ 'animate-pulse': isRefreshing }"
                    >
                      <!-- ✅ TAMBAH: Loading untuk mobile avatar -->
                      <div
                        v-if="isRefreshing"
                        class="absolute inset-0 bg-gray-200 flex items-center justify-center z-10 rounded-full"
                      >
                        <svg
                          class="w-4 h-4 text-gray-400 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      
                      <Transition
                        name="dropdown-image"
                        mode="out-in"
                        enter-active-class="transition-all duration-500 ease-out"
                        leave-active-class="transition-all duration-300 ease-in"
                        enter-from-class="opacity-0 scale-90"
                        enter-to-class="opacity-100 scale-100"
                        leave-from-class="opacity-100 scale-100"
                        leave-to-class="opacity-0 scale-90"
                      >
                        <img
                          :key="profilePhoto"
                          :src="profilePhoto"
                          :alt="userName"
                          class="w-full h-full object-cover"
                        />
                      </Transition>
                    </div>
                    <div class="flex-1 min-w-0">
                      <Transition
                        name="dropdown-text"
                        mode="out-in"
                        enter-active-class="transition-all duration-500 ease-out"
                        leave-active-class="transition-all duration-300 ease-in"
                        enter-from-class="opacity-0 translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-1"
                      >
                        <div :key="userName + userRole">
                          <div
                            class="text-sm font-semibold text-gray-900 truncate"
                            :title="userName"
                            :class="{ 'opacity-50': isRefreshing }"
                          >
                            {{ userName }}
                          </div>
                          <div 
                            class="text-xs text-gray-500"
                            :class="{ 'opacity-50': isRefreshing }"
                          >
                            {{ userRole }}
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>

                <!-- Edit Profile Button -->
                <button
                  @click="handleEditProfile"
                  :disabled="isRefreshing"
                  class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div
                    class="w-5 h-5 flex items-center justify-center bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.36 10.44L16.95 12.03L21.77 7.21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <span class="font-semibold">Edit Profil</span>
                </button>

                <!-- Separator -->
                <div class="border-t border-gray-100 my-1"></div>

                <!-- Logout Button -->
                <button
                  @click="handleLogout"
                  :disabled="isRefreshing"
                  class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div
                    class="w-5 h-5 flex items-center justify-center bg-gray-100 group-hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="text-gray-600 group-hover:text-red-600 transition-colors duration-200"
                    >
                      <g clip-path="url(#clip0_410_6997)">
                        <path
                          d="M19.0241 8.1427L15.7916 4.9102C15.6344 4.7584 15.4239 4.6744 15.2054 4.6763C14.9869 4.6782 14.7779 4.76584 14.6234 4.92035C14.4689 5.07485 14.3812 5.28386 14.3793 5.50236C14.3774 5.72086 14.4614 5.93136 14.6132 6.08853L17.8457 9.32103C17.9418 9.41897 18.0257 9.52808 18.0957 9.64603C18.0832 9.64603 18.0732 9.63936 18.0607 9.63936L4.99074 9.66603C4.76973 9.66603 4.55777 9.75383 4.40149 9.91011C4.24521 10.0664 4.15741 10.2783 4.15741 10.4994C4.15741 10.7204 4.24521 10.9323 4.40149 11.0886C4.55777 11.2449 4.76973 11.3327 4.99074 11.3327L18.0557 11.306C18.0791 11.306 18.0982 11.2944 18.1207 11.2927C18.0468 11.4337 17.9531 11.5633 17.8424 11.6777L14.6099 14.9102C14.5303 14.9871 14.4668 15.079 14.4232 15.1807C14.3795 15.2824 14.3565 15.3917 14.3555 15.5024C14.3546 15.613 14.3757 15.7227 14.4176 15.8252C14.4595 15.9276 14.5213 16.0206 14.5996 16.0989C14.6778 16.1771 14.7709 16.239 14.8733 16.2809C14.9757 16.3228 15.0854 16.3439 15.1961 16.3429C14.3067 16.3419 15.4161 16.319 15.5177 16.2753C15.6194 16.2316 15.7114 16.1681 15.7882 16.0885L19.0207 12.856C19.6456 12.2309 19.9967 11.3832 19.9967 10.4994C19.9967 9.61548 19.6456 8.76779 19.0207 8.1427H19.0241Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.83333 18.8333H4.16667C3.50363 18.8333 2.86774 18.5699 2.3989 18.1011C1.93006 17.6323 1.66667 16.9964 1.66667 16.3333V4.66667C1.66667 4.00363 1.93006 3.36774 2.3989 2.8989C2.86774 2.43006 3.50363 2.16667 4.16667 2.16667H5.83333C6.05435 2.16667 6.26631 2.07887 6.42259 1.92259C6.57887 1.76631 6.66667 1.55435 6.66667 1.33333C6.66667 1.11232 6.57887 0.900358 6.42259 0.744078C6.26631 0.587797 6.05435 0.5 5.83333 0.5H4.16667C3.062 0.501323 2.00296 0.940735 1.22185 1.72185C0.440735 2.50296 0.00132321 3.562 0 4.66667L0 16.3333C0.00132321 17.438 0.440735 18.497 1.22185 19.2782C2.00296 20.0593 3.062 20.4987 4.16667 20.5H5.83333C6.05435 20.5 6.26631 20.4122 6.42259 20.2559C6.57887 20.0996 6.66667 19.8877 6.66667 19.6667C6.66667 19.4457 6.57887 19.2337 6.42259 19.0774C6.26631 18.9211 6.05435 18.8333 5.83333 18.8333Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_410_6997">
                          <rect
                            width="20"
                            height="20"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span class="font-semibold">Keluar Akun</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main
      class="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-[1] pb-20 sm:pb-24 md:pb-28 pt-2 sm:pt-4"
    >
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
  /* ✅ TAMBAH: Custom transition styles */
  .profile-image-enter-active,
  .profile-image-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .profile-image-enter-from {
    opacity: 0;
    transform: scale(0.95) rotate(5deg);
  }

  .profile-image-leave-to {
    opacity: 0;
    transform: scale(0.95) rotate(-5deg);
  }

  .profile-text-enter-active,
  .profile-text-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .profile-text-enter-from {
    opacity: 0;
    transform: translateX(8px);
  }

  .profile-text-leave-to {
    opacity: 0;
    transform: translateX(-8px);
  }

  .dropdown-image-enter-active,
  .dropdown-image-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-image-enter-from,
  .dropdown-image-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  .dropdown-text-enter-active,
  .dropdown-text-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-text-enter-from {
    opacity: 0;
    transform: translateY(4px);
  }

  .dropdown-text-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  /* Extra small screen utilities */
  @media (min-width: 475px) {
    .xs\:block {
      display: block;
    }
  }

  /* Prevent horizontal scrolling and improve mobile experience */
  * {
    box-sizing: border-box;
  }

  /* Mobile-first improvements */
  @media (max-width: 640px) {
    /* Better touch targets on mobile */
    button {
      min-height: 48px;
      min-width: 48px;
    }
    /* Improved dropdown positioning for mobile */
    .absolute.right-0 {
      right: 0;
      left: auto;
      min-width: 208px; /* 52 * 4 = 208px, sesuai dengan w-52 */
    }

    /* Better dropdown content overflow protection */
    .absolute.right-0 > div {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* Better text readability on mobile - clean shadow */
    .text-white {
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    /* Profile name truncation for mobile */
    .profile-text-adaptive {
      max-width: 100px !important;
    }

    /* Improved header spacing on mobile - keep horizontal layout */
    header {
      padding-bottom: 1rem !important;
    }

    /* More compact logo for mobile horizontal layout */
    .font-poppins {
      letter-spacing: -0.01em;
    }

    /* Profile button improvements */
    .cursor-pointer {
      padding: 0.75rem !important;
      border-radius: 1rem !important;
    }
  }

  /* Medium screens improvements */
  @media (min-width: 641px) and (max-width: 1024px) {
    /* Optimize spacing for tablets */
    header {
      padding: 1.5rem 2rem;
    }

    main {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* Better visibility for very small screens - clean text */
  @media (max-width: 475px) {
    .text-white {
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      font-weight: 600;
    }

    /* Logo adjustments for very small screens - horizontal layout */
    .font-poppins {
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    /* Profile name truncation for very small screens */
    .profile-text-adaptive {
      max-width: 80px !important;
    }

    /* Ensure horizontal layout on very small screens */
    header .flex {
      gap: 0.5rem !important;
    }

    /* Dropdown adjustments for very small screens */
    #profile-dropdown-container .absolute {
      width: calc(100vw - 1rem) !important;
      right: 0.5rem !important;
      max-width: 200px !important;
    }

    /* More prominent profile button */
    .cursor-pointer {
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  /* High contrast mode improvements - clean text */
  @media (prefers-contrast: high) {
    .text-white {
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    .bg-white\/95 {
      background-color: rgba(255, 255, 255, 0.98) !important;
    }
  }

  /* Animation improvements for better performance */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }

  /* Ensure dropdown is always on top */
  .z-\[9999\] {
    z-index: 9999 !important;
  }

  .z-\[10000\] {
    z-index: 10000 !important;
  }

  .z-\[10001\] {
    z-index: 10001 !important;
  }

  /* Prevent dropdown from being covered by other elements */
  #profile-dropdown-container {
    position: relative;
    z-index: 10000 !important;
  }

  /* Dropdown content overflow fixes */
  #profile-dropdown-container .absolute {
    z-index: 10001 !important;
    max-width: calc(100vw - 2rem); /* Prevent dropdown from going off-screen */
  }

  /* Ensure text fits properly in dropdown */
  #profile-dropdown-container .truncate {
    max-width: 100%;
  }

  /* Better text wrapping for dropdown content */
  #profile-dropdown-container .text-sm {
    line-height: 1.4;
    word-break: break-word;
  }

  /* Override any competing z-index values */
  .transition.ease-out {
    z-index: 10000 !important;
  }

  /* Ensure dropdown menu appears above everything */
  #profile-dropdown-container .absolute {
    z-index: 10001 !important;
  }

  /* Improved backdrop blur support */
  @supports (backdrop-filter: blur(10px)) {
    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
    }

    .backdrop-blur-lg {
      backdrop-filter: blur(16px);
    }
  }

  /* Fallback for browsers without backdrop-filter */
  @supports not (backdrop-filter: blur(10px)) {
    .backdrop-blur-sm {
      background-color: rgba(255, 255, 255, 0.9);
    }

    .backdrop-blur-lg {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }

  /* Safe area adjustments for mobile devices with notches */
  @supports (padding: max(0px)) {
    header {
      padding-left: max(1rem, env(safe-area-inset-left));
      padding-right: max(1rem, env(safe-area-inset-right));
      padding-top: max(1rem, env(safe-area-inset-top));
    }

    main {
      padding-left: max(1rem, env(safe-area-inset-left));
      padding-right: max(1rem, env(safe-area-inset-right));
      padding-bottom: max(5rem, env(safe-area-inset-bottom));
    }
  }

  /* Adaptive text color for profile name - clean white text */
  .profile-text-adaptive {
    color: white;
    /* Subtle shadow for better readability without black border */
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    transition: all 0.3s ease;
  }

  /* Enhanced text shadow for high contrast mode - without black border */
  @media (prefers-contrast: high) {
    .profile-text-adaptive {
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
    }
  }

  /* Alternative approach for better contrast - clean appearance */
  @media (prefers-contrast: high) {
    .profile-text-adaptive {
      color: white;
      text-shadow:
        0 1px 4px rgba(0, 0, 0, 0.9),
        0 2px 8px rgba(0, 0, 0, 0.6);
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
    }
  }
</style>
