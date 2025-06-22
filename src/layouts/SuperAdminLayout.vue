<script setup>
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import { reactive, ref, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import { computed } from 'vue'
  import { config } from '@/config/env'
  import Bulog from '@/assets/images/bulog.png'
  import InputIconElement from '@/components/InputIconElement.vue'
  import RiwayatIconElement from '@/components/RiwayatIconElement.vue'
  import StaffIconElement from '@/components/StaffIconElement.vue'
  import PemohonIconElement from '@/components/PemohonIconElement.vue'
  import SignOutIconElement from '@/components/SignOutIconElement.vue'
  import DashboardIconElement from '@/components/DashboardIconElement.vue'
  import PengadaanIconElement from '@/components/PengadaanIconElement.vue'

  const auth = useAuthStore()
  const router = useRouter()
  const userName = computed(() => auth.user?.name || 'Pengguna')

  const isHovered = reactive({
    dashboard: false,
    input: false,
    riwayat: false,
    staff: false,
    pemohon: false,
    pengadaan: false,
    signout: false,
  })

  const route = useRoute()
  const sidebarOpen = ref(false)

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      auth.clearAuth()
      router.push('/login')
    }
  }

  // Profile photo
  const profilePhoto = computed(() => {
    const foto =
      auth.user?.profile_photo ||
      auth.user?.foto ||
      auth.user?.img ||
      auth.user?.gambar ||
      auth.user?.photo

    if (foto) {
      return config.getStorageUrl(foto)
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || 'Pengguna')}&background=0099FF&color=fff&size=128`
  })

  // Toggle sidebar
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  // Close sidebar when clicking outside (mobile only)
  const handleClickOutside = (event) => {
    if (window.innerWidth >= 1024) return // Don't handle on desktop

    const sidebar = document.getElementById('sidebar')
    const menuButton = document.getElementById('menu-button')

    if (
      sidebar &&
      !sidebar.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      sidebarOpen.value = false
    }
  }

  // Handle escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape' && sidebarOpen.value) {
      sidebarOpen.value = false
    }
  }

  // Close sidebar when route changes (mobile)
  const closeSidebarOnRoute = () => {
    if (window.innerWidth < 1024) {
      sidebarOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
      @click="sidebarOpen = false"
    ></div>

    <!-- SIDEBAR -->
    <div
      id="sidebar"
      class="fixed lg:relative inset-y-0 left-0 z-100 flex h-full transition-all duration-300 ease-in-out lg:translate-x-0 lg:z-auto"
      :class="[
        'w-64 sm:w-72',
        sidebarOpen
          ? 'translate-x-0 shadow-2xl'
          : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div
        class="flex w-full py-8 lg:py-14 px-3 sm:px-5 justify-center shadow-xl outline-gray-200 outline-1 bg-white/95 backdrop-blur-md h-full overflow-y-auto relative"
      >
        <!-- Close button for mobile (sticky) -->
        <button
          @click="toggleSidebar"
          class="absolute top-4 right-4 lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 z-10"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="flex flex-col gap-4 items-center justify-between w-full">
          <div class="flex flex-col items-center w-full">
            <!-- LOGO -->
            <img
              loading="lazy"
              :src="Bulog"
              alt="Bulog Logo"
              class="w-32 sm:w-38 -ml-1"
            />

            <div class="flex flex-col gap-3 sm:gap-4 w-full">
              <!-- DASHBOARD -->
              <RouterLink
                to="/superadmin/dashboard"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 mt-8 sm:mt-16 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.dashboard || route.path === '/superadmin/dashboard'
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.dashboard = true"
                @mouseleave="isHovered.dashboard = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <DashboardIconElement
                    :color="
                      isHovered.dashboard ||
                      route.path === '/superadmin/dashboard'
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.dashboard ||
                      route.path === '/superadmin/dashboard'
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Dashboard
                  </div>
                </div>
              </RouterLink>

              <!-- INPUT -->
              <RouterLink
                to="/superadmin/input"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.input || route.path === '/superadmin/input'
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.input = true"
                @mouseleave="isHovered.input = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <InputIconElement
                    :color="
                      isHovered.input || route.path === '/superadmin/input'
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                    :innerColor="
                      isHovered.input || route.path === '/superadmin/input'
                        ? '#0099FF'
                        : '#ffff'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.input || route.path === '/superadmin/input'
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Input
                  </div>
                </div>
              </RouterLink>

              <!-- RIWAYAT -->
              <RouterLink
                to="/superadmin/riwayat"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.riwayat ||
                  route.path === '/superadmin/riwayat' ||
                  route.path.startsWith('/superadmin/riwayat-edit') ||
                  route.path.startsWith('/superadmin/riwayat-preview')
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.riwayat = true"
                @mouseleave="isHovered.riwayat = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <RiwayatIconElement
                    :color="
                      isHovered.riwayat ||
                      route.path === '/superadmin/riwayat' ||
                      route.path.startsWith('/superadmin/riwayat-edit') ||
                      route.path.startsWith('/superadmin/riwayat-preview')
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.riwayat ||
                      route.path === '/superadmin/riwayat' ||
                      route.path.startsWith('/superadmin/riwayat-edit') ||
                      route.path.startsWith('/superadmin/riwayat-preview')
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Riwayat
                  </div>
                </div>
              </RouterLink>

              <!-- STAFF -->
              <RouterLink
                to="/superadmin/admin"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.staff ||
                  route.path === '/superadmin/admin' ||
                  route.path === '/superadmin/admin-add' ||
                  route.path.startsWith('/superadmin/admin-edit')
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.staff = true"
                @mouseleave="isHovered.staff = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <StaffIconElement
                    :color="
                      isHovered.staff ||
                      route.path === '/superadmin/admin' ||
                      route.path === '/superadmin/admin-add' ||
                      route.path.startsWith('/superadmin/admin-edit')
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                    :stroke="
                      isHovered.staff ||
                      route.path === '/superadmin/admin' ||
                      route.path === '/superadmin/admin-add' ||
                      route.path.startsWith('/superadmin/admin-edit')
                        ? '#0099FF'
                        : '#ffff'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.staff ||
                      route.path === '/superadmin/admin' ||
                      route.path === '/superadmin/admin-add' ||
                      route.path.startsWith('/superadmin/admin-edit')
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Admin
                  </div>
                </div>
              </RouterLink>

              <!-- DATA PEMOHON -->
              <RouterLink
                to="/superadmin/datapemohon"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.pemohon ||
                  route.path === '/superadmin/datapemohon' ||
                  route.path.startsWith('/superadmin/datapemohon-list') ||
                  route.path.startsWith('/superadmin/datapemohon-edit')
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.pemohon = true"
                @mouseleave="isHovered.pemohon = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <PemohonIconElement
                    :color="
                      isHovered.pemohon ||
                      route.path === '/superadmin/datapemohon' ||
                      route.path.startsWith('/superadmin/datapemohon-list') ||
                      route.path.startsWith('/superadmin/datapemohon-edit')
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                    :stroke="
                      isHovered.pemohon ||
                      route.path === '/superadmin/datapemohon' ||
                      route.path.startsWith('/superadmin/datapemohon-list') ||
                      route.path.startsWith('/superadmin/datapemohon-edit')
                        ? '#0099FF'
                        : '#ffff'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.pemohon ||
                      route.path === '/superadmin/datapemohon' ||
                      route.path.startsWith('/superadmin/datapemohon-list') ||
                      route.path.startsWith('/superadmin/datapemohon-edit')
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Pemohon
                  </div>
                </div>
              </RouterLink>

              <!-- SETTING PENGADAAN -->
              <RouterLink
                to="/superadmin/settingpengadaan"
                @click="closeSidebarOnRoute"
                class="group flex px-4 sm:px-7 w-full h-10 sm:h-12 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm"
                :class="[
                  isHovered.pengadaan ||
                  route.path === '/superadmin/settingpengadaan' ||
                  route.path.startsWith('/superadmin/settingpengadaan-list') ||
                  route.path.startsWith('/superadmin/settingpengadaan-edit')
                    ? 'scale-95 bg-[#0099FF]/90 shadow-lg backdrop-blur-md transform'
                    : 'hover:scale-95 hover:bg-[#0099FF]/80 hover:shadow-md hover:backdrop-blur-sm',
                ]"
                @mouseenter="isHovered.pengadaan = true"
                @mouseleave="isHovered.pengadaan = false"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <PengadaanIconElement
                    :color="
                      isHovered.pengadaan ||
                      route.path === '/superadmin/settingpengadaan' ||
                      route.path.startsWith(
                        '/superadmin/settingpengadaan-list',
                      ) ||
                      route.path.startsWith('/superadmin/settingpengadaan-edit')
                        ? '#ffff'
                        : '#9BA1AA'
                    "
                    :stroke="
                      isHovered.pengadaan ||
                      route.path === '/superadmin/settingpengadaan' ||
                      route.path.startsWith(
                        '/superadmin/settingpengadaan-list',
                      ) ||
                      route.path.startsWith('/superadmin/settingpengadaan-edit')
                        ? '#0099FF'
                        : '#ffff'
                    "
                  />
                  <div
                    class="font-poppins font-medium text-[#9BA1AA] text-xs sm:text-sm transition-colors duration-200"
                    :class="
                      isHovered.pengadaan ||
                      route.path === '/superadmin/settingpengadaan' ||
                      route.path.startsWith(
                        '/superadmin/settingpengadaan-list',
                      ) ||
                      route.path.startsWith('/superadmin/settingpengadaan-edit')
                        ? 'text-white'
                        : 'group-hover:text-white'
                    "
                  >
                    Pengadaan
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- LOGOUT -->
          <button
            @click="handleLogout"
            class="group flex bottom-0 h-fit gap-2 sm:gap-3 items-center justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            @mouseenter="isHovered.signout = true"
            @mouseleave="isHovered.signout = false"
          >
            <div
              class="text-hover font-poppins font-medium text-[#9BA1AA] group-hover:text-[#0099FF] text-xs sm:text-sm transition-colors duration-200"
            >
              Log out
            </div>
            <SignOutIconElement
              :color="isHovered.signout ? '#0099FF' : '#9BA1AA'"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 min-w-0 lg:ml-0 flex flex-col h-full">
      <!-- NAVBAR -->
      <div class="flex-shrink-0">
        <div
          class="flex bg-[#0099FF] h-16 sm:h-18 w-full items-center px-4 sm:px-12 justify-between lg:justify-end gap-3 sm:gap-5"
        >
          <!-- Mobile Menu Button with Hamburger Animation -->
          <button
            id="menu-button"
            @click="toggleSidebar"
            class="lg:hidden p-2 text-white hover:bg-blue-600 rounded-md transition-all duration-300 relative group"
          >
            <div
              class="w-6 h-6 relative flex flex-col justify-center items-center"
            >
              <span
                class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out"
                :class="
                  sidebarOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
                "
              ></span>
              <span
                class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1"
                :class="sidebarOpen ? 'opacity-0' : 'opacity-100'"
              ></span>
              <span
                class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1"
                :class="
                  sidebarOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
                "
              ></span>
            </div>
          </button>

          <!-- User Profile -->
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="-mr-1 sm:-mr-2">
              <img
                loading="lazy"
                :src="profilePhoto"
                :alt="userName"
                class="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover outline outline-white transition-transform duration-200 hover:scale-105"
                @error="
                  (e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0099FF&color=fff&size=128`
                  }
                "
              />
            </div>
            <div
              class="font-poppins font-medium text-white text-sm sm:text-base truncate max-w-32 sm:max-w-none"
            >
              {{ userName }}
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div
        class="flex-1 overflow-y-auto bg-gray-50 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Custom scrollbar for sidebar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.3);
    border-radius: 2px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.5);
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition-property:
      transform, background-color, border-color, text-decoration-color, fill,
      stroke, opacity, box-shadow, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
