<script setup>
  import GuestLayout from '@/layouts/GuestLayout.vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const newPassword = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const requestSent = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)

  const handleSubmit = async () => {
    // Clear previous error messages
    errorMessage.value = ''

    // Validation
    if (!newPassword.value) {
      errorMessage.value = 'Password baru harus diisi'
      return
    }

    if (newPassword.value.length < 6) {
      errorMessage.value = 'Password baru minimal 6 karakter'
      return
    }

    if (!confirmPassword.value) {
      errorMessage.value = 'Konfirmasi password harus diisi'
      return
    }

    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Password baru dan konfirmasi password tidak sama'
      return
    }

    isLoading.value = true
    try {
      // Here you would add your actual password reset request logic
      console.log('Reset password request')
      console.log('New password:', newPassword.value)

      // Simulate successful request
      setTimeout(() => {
        requestSent.value = true
        isLoading.value = false
        // Redirect to ResetPasswordAccepted after a short delay
        // Give user time to see success message before redirecting
      }, 1000)
    } catch (error) {
      errorMessage.value = 'Permintaan gagal, silakan coba lagi'
      isLoading.value = false
    }
  }

  const toggleNewPasswordVisibility = () => {
    showNewPassword.value = !showNewPassword.value
  }

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value
  }

  const goToLogin = () => {
    router.push('/')
  }
</script>

<template>
  <GuestLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Reset Password Card -->
      <div class="bg-white rounded-lg w-full max-w-md shadow-lg p-8">
        <!-- Logo and Title -->
        <div class="text-center mb-8 font-poppins">
          <h1
            class="text-3xl font-bold flex justify-center items-center text-shadow-lg"
          >
            <div class="text-[#F0AB26]">Si</div>
            <div class="text-[#176BC7]">PEDAGANG</div>
          </h1>
          <div class="text-gray-600 mt-2 text-sm">
            Masukkan password baru untuk akun Anda
          </div>
        </div>

        <!-- Request Form -->
        <form
          v-if="!requestSent"
          @submit.prevent="handleSubmit"
          class="space-y-4"
        >
          <!-- Error message if any -->
          <div
            v-if="errorMessage"
            class="text-center bg-red-100 text-red-700 p-3 rounded text-sm"
          >
            {{ errorMessage }}
          </div>

          <!-- New Password field -->
          <div>
            <label
              for="newPassword"
              class="font-poppins block text-sm text-gray-700 mb-1"
              >Password Baru</label
            >
            <div class="relative">
              <input
                id="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                v-model="newPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10 text-sm font-inter"
                placeholder="Masukkan password baru (min. 6 karakter)"
              />
              <button
                type="button"
                @click="toggleNewPasswordVisibility"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  v-if="!showNewPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password field -->
          <div>
            <label
              for="confirmPassword"
              class="font-poppins block text-sm text-gray-700 mb-1"
              >Konfirmasi Password Baru</label
            >
            <div class="relative">
              <input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10 text-sm"
                placeholder="Masukkan ulang password baru"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  v-if="!showConfirmPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full bg-[#176BC7] text-white py-2.5 rounded-full font-medium hover:bg-[#0099FF] transition-colors duration-200 ease-in-out cursor-pointer font-poppins"
              :disabled="isLoading"
            >
              <div v-if="isLoading">Mengirim Permintaan...</div>
              <div v-else>Kirim Permintaan Reset Password</div>
            </button>
          </div>

          <!-- Help text -->
          <div class="font-poppins text-center text-gray-500 text-sm">
            Permintaan akan diverifikasi oleh SuperAdmin
          </div>
        </form>

        <!-- Success message after request sent -->
        <div v-else class="space-y-6 text-center">
          <div class="p-4 bg-blue-50 text-blue-700 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 mx-auto text-blue-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="font-medium mb-1">Permintaan Terkirim!</h3>
            <p class="text-sm pb-2">
              Permintaan reset password Anda telah dikirim ke SuperAdmin untuk
              diverifikasi. Silakan tunggu persetujuan dari SuperAdmin.
            </p>
          </div>
        </div>

        <!-- Return to login -->
        <div class="mt-8 pt-4 text-center border-t border-gray-200">
          <button
            @click="goToLogin"
            class="text-[#0099FF] hover:underline bg-gray-100 w-full py-3 rounded-md cursor-pointer font-poppins"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
