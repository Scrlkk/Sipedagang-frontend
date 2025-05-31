<script setup>
  import GuestLayout from '@/layouts/GuestLayout.vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const username = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const requestSent = ref(false)

  const handleSubmit = async () => {
    if (!username.value) {
      errorMessage.value = 'Nama pengguna harus diisi'
      return
    }

    isLoading.value = true
    try {
      // Here you would add your actual password reset request logic
      console.log('Reset password for:', username.value)

      // Simulate successful request
      setTimeout(() => {
        requestSent.value = true
        isLoading.value = false
        // Redirect to ResetPasswordAccepted after a short delay
        setTimeout(() => {
          router.push('/resetpassword-accepted')
        }, 1500) // Give user time to see success message before redirecting
      }, 1000)
    } catch (error) {
      errorMessage.value = 'Permintaan gagal, silakan coba lagi'
      isLoading.value = false
    }
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
        <div class="text-center mb-8 font-poppins">
          <h1
            class="text-3xl font-bold flex justify-center items-center text-shadow-lg"
          >
            <div class="text-[#F0AB26]">Si</div>
            <div class="text-[#176BC7]">PEDAGANG</div>
          </h1>
          <div class="text-gray-600 mt-2 text-sm">
            Masukkan nama pengguna anda, kami akan memverifikasi akun anda
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

          <!-- Username field -->
          <div>
            <label
              for="username"
              class="font-poppins block text-sm text-gray-700 mb-1"
              >Nama Pengguna</label
            >
            <input
              id="username"
              type="text"
              v-model="username"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full bg-[#176BC7] text-white py-2.5 rounded-full font-medium font-poppins hover:bg-[#0099FF] transition-colors cursor-pointer"
              :disabled="isLoading"
            >
              <div v-if="isLoading">Loading...</div>
              <div v-else>Kirim Tautan Reset</div>
            </button>
          </div>

          <!-- Help text -->
          <div class="font-poppins text-center text-gray-500 text-sm">
            Tidak bisa mengakses? hubungi SuperAdmin
          </div>
        </form>
        <!-- Success message after request sent -->
        <div v-else class="space-y-6 text-center">
          <div class="p-4 bg-green-50 text-green-700 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 mx-auto text-green-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="font-medium mb-1">Verifikasi Pengguna Berhasil!</h3>
            <p>
              Nama pengguna telah dikonfirmasi. Anda akan dialihkan ke halaman
              reset kata sandi.
            </p>
            <div class="mt-2 text-sm">
              <div
                class="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"
              ></div>
              <div
                class="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500 mx-1"
              ></div>
              <div
                class="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"
              ></div>
            </div>
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
