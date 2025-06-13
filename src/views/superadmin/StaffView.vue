<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useAdminStore } from '@/stores/adminStore'
  import { useResetPasswordStore } from '@/stores/resetStore'
  import { RouterLink } from 'vue-router'
  import { config } from '@/config/env'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import StaffElement from '@/components/StaffElement.vue'
  import MainElement from '../../components/MainElement.vue'
  import StaffResetElement from '@/components/StaffResetElement.vue'
  import defaultProfile from '@/assets/images/misc/default-profile.png'

  const showPopup = ref(false)
  const adminStore = useAdminStore()
  const resetStore = useResetPasswordStore()
  const search = ref('')
  const showInactive = ref(false)

  const getPhotoUrl = (photoPath) => {
    return config.getStorageUrl(photoPath) || defaultProfile
  }

  onMounted(() => {
    adminStore.getAdmins('', '')
  })

  watch(showPopup, (newValue) => {
    if (newValue) {
      resetStore.fetchResetRequests()
    }
  })

  const filteredAdmins = computed(() => {
    let filtered = adminStore.admins || []

    if (showInactive.value) {
      filtered = filtered.filter((admin) => admin.status === 'inactive')
    } else {
      filtered = filtered.filter(
        (admin) => admin.status === 'active' || !admin.status,
      )
    }

    if (search.value && search.value.trim()) {
      const searchTerm = search.value.toLowerCase()
      filtered = filtered.filter(
        (admin) =>
          admin.name?.toLowerCase().includes(searchTerm) ||
          admin.nama_pengguna?.toLowerCase().includes(searchTerm),
      )
    }

    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()

      return nameA.localeCompare(nameB, 'id', {
        sensitivity: 'base',
        numeric: true,
        caseFirst: 'lower',
      })
    })

    return filtered
  })

  const toggleInactiveView = () => {
    showInactive.value = !showInactive.value
  }

  const buttonLabel = computed(() => {
    return showInactive.value ? 'Active Staff' : 'Inactive Staff'
  })

  const buttonClass = computed(() => {
    return showInactive.value
      ? 'bg-[#4CAF50] hover:bg-[#45a049]'
      : 'bg-gray-500 hover:bg-gray-400'
  })

  const closeResetPopup = () => {
    showPopup.value = false
    resetStore.clearAdminMessages()
  }
</script>

<template>
  <SuperAdminLayout>
    <section class="relative">
      <MainElement
        :class="showPopup ? 'blur-[3px] pointer-events-none select-none' : ''"
      >
        <div class="flex flex-col h-full">
          <!-- ATAS -->
          <section
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 flex-shrink-0"
          >
            <!-- TITLE -->
            <div
              class="font-semibold text-sm sm:text-base lg:text-lg text-[#0099FF] underline underline-offset-4 flex-shrink-0"
            >
              Admin - {{ showInactive ? 'Inactive' : 'Active' }}
            </div>
            <!-- NAV -->
            <div
              class="flex flex-col xs:flex-row items-stretch xs:items-center gap-2"
            >
              <!-- Button Container -->
              <div class="flex gap-1 sm:gap-2 items-center">
                <!-- Search Input -->
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search"
                  class="border border-[#D9D9D9] rounded-md h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm w-full xs:w-auto xs:min-w-[140px] focus:outline-[#0099ff] focus:border-[#0099ff] transition-all duration-200"
                />

                <!-- Reset Password Button -->
                <button
                  class="flex bg-[#164E8A] hover:bg-[#0d3660] px-2 sm:px-3 h-7 sm:h-8 font-medium text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out whitespace-nowrap"
                  @click="showPopup = true"
                >
                  Reset Password
                </button>

                <!-- Add Staff Button -->
                <RouterLink
                  to="/superadmin/admin-add"
                  class="flex bg-[#4CAF50] hover:bg-[#45a049] px-2 sm:px-3 h-7 sm:h-8 font-medium text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out whitespace-nowrap"
                >
                  Tambah Staff
                </RouterLink>

                <!-- Toggle Status Button -->
                <button
                  :class="[
                    'flex px-2 sm:px-3 h-7 sm:h-8 font-medium text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out whitespace-nowrap',
                    buttonClass,
                  ]"
                  @click="toggleInactiveView"
                >
                  {{ showInactive ? 'Active' : 'Inactive' }}
                </button>
              </div>
            </div>
          </section>
          <!-- STAFF -->
          <section
            class="flex-1 px-1 sm:px-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}] pb-2"
          >
            <div
              v-if="adminStore.loading"
              class="flex justify-center items-center h-full min-h-[300px]"
            >
              <div class="text-gray-500 text-sm">Loading...</div>
            </div>

            <div
              v-else-if="filteredAdmins.length === 0"
              class="flex flex-col items-center justify-center h-full min-h-[300px] w-full py-4"
            >
              <div
                v-if="search"
                class="text-gray-500 text-sm sm:text-base font-medium text-center px-4"
              >
                {{ showInactive ? 'Staff inactive' : 'Staff active' }} tidak
                ditemukan
              </div>
              <div
                v-else
                class="text-gray-500 text-sm sm:text-base font-medium text-center px-4"
              >
                {{
                  showInactive
                    ? 'Tidak ada staff inactive'
                    : 'Tidak ada staff active'
                }}
              </div>
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 py-1 sm:py-2"
            >
              <StaffElement
                v-for="person in filteredAdmins"
                :key="person.id"
                :person="{
                  id: person.id,
                  nama: person.name,
                  nama_pengguna: person.nama_pengguna,
                  img: getPhotoUrl(person.profile_photo),
                  status: person.status || 'active',
                }"
              />
            </div>
          </section>
        </div>
      </MainElement>

      <StaffResetElement :show="showPopup" @close="closeResetPopup" />
    </section>
  </SuperAdminLayout>
</template>
