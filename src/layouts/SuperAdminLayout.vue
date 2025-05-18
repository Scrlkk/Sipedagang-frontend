<script setup>
  import Bulog from '@/assets/images/bulog.png'
  import Kaisar from '@/assets/images/misc/kaisar.jpg'
  import InputIconElement from '@/components/InputIconElement.vue'
  import RiwayatIconElement from '@/components/RiwayatIconElement.vue'
  import StaffIconElement from '../components/StaffIconElement.vue'
  import RekapIconElement from '../components/RekapIconElement.vue'
  import SignOutIconElement from '../components/SignOutIconElement.vue'
  import NotifIconElement from '../components/NotifIconElement.vue'
  import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex">
    <!-- SIDEBAR -->
    <div
      class="flex w-72 h-screen py-14 px-5 justify-center shadow-xl outline-gray-200 outline-1"
    >
      <!-- LOGO -->
      <div class="flex flex-col gap-4 items-center justify-between">
        <div class="flex flex-col items-center">
          <img
            loading="lazy"
            :src="Bulog"
            alt="Bulog Logo"
            class="w-38 -ml-1"
          />

          <div class="flex flex-col gap-4">
            <!-- DASHBOARD -->
            <RouterLink
              to="/"
              class="flex px-7 bg-[#0099FF] w-55 h-12 mt-16 rounded-xl shadow-2xl"
            >
              <div class="flex items-center gap-3">
                <div>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 26 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.53711 13.7639C9.33224 13.7639 10.7705 15.1332 10.7705 16.8372V20.928C10.7704 22.6199 9.33218 24.0002 7.53711 24.0002H3.2334C1.45123 24 9.07951e-05 22.6198 0 20.928V16.8372C0 15.1333 1.45117 13.7641 3.2334 13.7639H7.53711ZM22.2295 13.7639C24.0118 13.764 25.4629 15.1332 25.4629 16.8372V20.928C25.4628 22.6199 24.0118 24.0002 22.2295 24.0002H17.9258C16.1308 24.0001 14.6925 22.6198 14.6924 20.928V16.8372C14.6924 15.1333 16.1308 13.7641 17.9258 13.7639H22.2295ZM7.53711 0.000244141C9.33224 0.000264071 10.7705 1.3803 10.7705 3.07349V7.16431C10.7705 8.86827 9.33222 10.2366 7.53711 10.2366H3.2334C1.45119 10.2364 3.5468e-05 8.86815 0 7.16431V3.07349C0 1.38042 1.45117 0.000456838 3.2334 0.000244141H7.53711ZM22.2295 0.000244141C24.0118 0.000327217 25.4629 1.38034 25.4629 3.07349V7.16431C25.4629 8.86823 24.0118 10.2365 22.2295 10.2366H17.9258C16.1308 10.2364 14.6924 8.86819 14.6924 7.16431V3.07349C14.6924 1.38038 16.1308 0.00039278 17.9258 0.000244141H22.2295Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
                <div class="font-poppins font-medium text-white text-sm">
                  Dashboard
                </div>
              </div>
            </RouterLink>

            <!-- INPUT -->
            <RouterLink to="/input" class="flex px-7 w-55 h-12 mt-1 rounded-xl">
              <div class="flex items-center gap-3">
                <InputIconElement />
                <div class="font-poppins font-medium text-[#9BA1AA] text-sm">
                  Input
                </div>
              </div>
            </RouterLink>

            <!-- Riwayat -->
            <RouterLink
              to="/riwayat"
              class="flex px-7 w-55 h-12 mt-1 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <RiwayatIconElement />
                <div class="font-poppins font-medium text-[#9BA1AA] text-sm">
                  Riwayat
                </div>
              </div>
            </RouterLink>

            <!-- STAFF -->
            <RouterLink to="/staff" class="flex px-7 w-55 h-12 mt-1 rounded-xl">
              <div class="flex items-center gap-3">
                <StaffIconElement />
                <div class="font-poppins font-medium text-[#9BA1AA] text-sm">
                  Staff
                </div>
              </div>
            </RouterLink>

            <!-- REKAP DATA -->
            <RouterLink
              to="/rekapdata"
              class="flex px-7 w-55 h-12 mt-1 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <RekapIconElement />
                <div class="font-poppins font-medium text-[#9BA1AA] text-sm">
                  Rekap Data
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- LOGOUT -->
        <div class="flex bottom-0 h-fit gap-3 items-center justify-center">
          <div class="font-poppins font-medium text-[#9BA1AA]">Log out</div>
          <SignOutIconElement />
        </div>
      </div>
    </div>

    <!-- NAVBAR -->
    <div class="w-full h-full">
      <div>
        <div
          class="flex bg-[#0099FF] h-18 w-full items-center px-12 justify-end gap-5"
        >
          <NotifIconElement />
          <div class="-mr-2">
            <img
              loading="lazy"
              :src="Kaisar"
              alt="Profile Picture"
              class="w-11 h-11 rounded-full"
            />
          </div>
          <div class="font-poppins font-medium text-white">SuperAdmin</div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <slot />
    </div>
  </div>
</template>
