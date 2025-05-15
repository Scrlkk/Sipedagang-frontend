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
        <!-- Logo and Title -->
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold">
            <span class="text-[#F0AB26]">Si</span><span class="text-[#0099FF]">PEDAGANG</span>
          </h1>
          <p class="text-gray-600 mt-3 text-sm px-4">
            Masukkan email, kami akan mengirim Anda tautan untuk kembalikan akun Anda.
          </p>
        </div>
        
        <!-- Request Form -->
        <form v-if="!requestSent" @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Error message if any -->
          <div v-if="errorMessage" class="text-center bg-red-100 text-red-700 p-3 rounded text-sm">
            {{ errorMessage }}
          </div>
          
          <!-- Username field -->
          <div>
            <label for="username" class="block text-sm text-gray-700 mb-1">Nama Pengguna</label>
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
              class="w-full bg-[#176BC7] text-white py-2.5 rounded-full font-medium hover:bg-blue-600 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>Kirim Tautan Masuk</span>
            </button>
          </div>
          
          <!-- Help text -->
          <div class="text-center text-gray-500 text-sm">
            Tidak bisa mengakses? hubungi admin
          </div>
        </form>
        
        <!-- Success message after request sent -->
        <div v-else class="space-y-6 text-center">
          <div class="p-3 bg-green-50 text-green-700 rounded-md">
            Tautan reset kata sandi telah dikirim. Silakan periksa email Anda.
          </div>
        </div>
        
        <!-- Return to login -->
        <div class="mt-8 pt-4 text-center border-t border-gray-200">
          <button 
            @click="goToLogin"
            class="text-[#0099FF] hover:underline bg-gray-100 w-full py-3 rounded-md"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>