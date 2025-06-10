<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useAdminStore } from '@/stores/adminStore'
  import { useResetPasswordStore } from '@/stores/resetStore'
  import { RouterLink } from 'vue-router'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import StaffElement from '@/components/StaffElement.vue'
  import MainElement from '../../components/MainElement.vue'
  import StaffResetElement from '@/components/StaffResetElement.vue'
  import defaultProfile from '@/assets/images/misc/default-profile.png'
  import { config } from '@/config/env'

  const showPopup = ref(false)
  const adminStore = useAdminStore()
  const resetStore = useResetPasswordStore()
  const search = ref('')
  const showInactive = ref(false)

  // ✅ Helper function menggunakan config environment
  const getPhotoUrl = (photoPath) => {
    return config.getStorageUrl(photoPath) || defaultProfile
  }

  onMounted(() => {
    // Load semua data dari backend
    adminStore.getAdmins('', '') // Parameter kosong untuk mendapat semua data
  })

  // Watch untuk load reset requests ketika popup dibuka
  watch(showPopup, (newValue) => {
    if (newValue) {
      resetStore.fetchResetRequests()
    }
  })

  // Filtrasi manual di frontend
  const filteredAdmins = computed(() => {
    let filtered = adminStore.admins || []

    // Filter berdasarkan status active/inactive
    if (showInactive.value) {
      filtered = filtered.filter((admin) => admin.status === 'inactive')
    } else {
      filtered = filtered.filter(
        (admin) => admin.status === 'active' || !admin.status,
      )
    }

    // Filter berdasarkan search term
    if (search.value && search.value.trim()) {
      const searchTerm = search.value.toLowerCase()
      filtered = filtered.filter(
        (admin) =>
          admin.name?.toLowerCase().includes(searchTerm) ||
          admin.nama_pengguna?.toLowerCase().includes(searchTerm),
      )
    }

    // ✅ Urutkan berdasarkan nama secara alfabetis dengan sorting numerik yang benar
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()

      // Jika kedua nama mengandung angka, gunakan natural sort
      return nameA.localeCompare(nameB, 'id', {
        sensitivity: 'base',
        numeric: true, // ✅ Tambahkan ini untuk sorting numerik yang benar
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
        <!-- ATAS -->
        <section class="flex justify-between">
          <!-- TITLE -->
          <div
            class="font-semibold text-lg text-[#0099FF] underline underline-offset-8"
          >
            Management Staff - {{ showInactive ? 'Inactive' : 'Active' }}
          </div>

          <!-- NAV -->
          <div class="flex items-center mt-1 gap-4">
            <input
              v-model="search"
              type="text"
              placeholder="Search"
              class="border border-[#D9D9D9] rounded-md h-8 px-5 text-sm focus:outline-[#0099ff]"
            />
            <div
              class="flex bg-[#164E8A] w-[9rem] h-9 font-bold text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 ease-in-out"
              @click="showPopup = true"
            >
              Reset Password
            </div>
            <RouterLink
              to="/superadmin/staff-add"
              class="flex bg-[#4CAF50] w-[9rem] h-9 font-bold text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 ease-in-out"
            >
              Tambah Staff
            </RouterLink>
            <div
              :class="[
                'flex w-[7.5rem] h-9 font-bold text-white text-xs justify-center items-center rounded-md cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 ease-in-out',
                buttonClass,
              ]"
              @click="toggleInactiveView"
            >
              {{ buttonLabel }}
            </div>
          </div>
        </section>

        <!-- STAFF -->
        <section
          class="mt-6 px-4 h-[67dvh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar:{display:none}]"
        >
          <div
            v-if="adminStore.loading"
            class="flex justify-center items-center h-full"
          >
            <div class="text-gray-500">Loading...</div>
          </div>

          <div
            v-else-if="filteredAdmins.length === 0"
            class="flex flex-col items-center justify-center h-full w-full py-10"
          >
            <div
              v-if="search"
              class="text-gray-500 text-lg font-semibold text-center"
            >
              {{ showInactive ? 'Staff inactive' : 'Staff active' }} tidak
              ditemukan
            </div>
            <div v-else class="text-gray-500 text-lg font-semibold text-center">
              {{
                showInactive
                  ? 'Tidak ada staff inactive'
                  : 'Tidak ada staff active'
              }}
            </div>
          </div>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 py-4"
          >
            <StaffElement
              v-for="person in filteredAdmins"
              :key="person.id"
              :person="{
                id: person.id,
                nama: person.name,
                nama_pengguna: person.nama_pengguna,
                // ✅ Format URL foto dengan benar
                img: getPhotoUrl(person.profile_photo),
                status: person.status || 'active',
              }"
            />
          </div>
        </section>
      </MainElement>

      <!-- STAFF RESET POPUP -->
      <StaffResetElement :show="showPopup" @close="closeResetPopup" />
    </section>
  </SuperAdminLayout>
</template>
