<script setup>
import GuestLayout from '@/layouts/GuestLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false) // Add this to track password visibility

const handleLogin = async () => {
 if (!username.value || !password.value) {
    errorMessage.value = 'Nama pengguna dan kata sandi harus diisi'
    return
  }
  
  isLoading.value = true
  
  try {
    // Here you would add your actual login logic
    console.log('Login with:', username.value, password.value)
    
    // Simulate successful login
    setTimeout(() => {
      router.push('/admin/dashboard')
      isLoading.value = false
    }, 1000)
  } catch (error) {
    errorMessage.value = 'Login gagal, silakan coba lagi'
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleForgotPassword = () => {
  // Handle forgot password
  console.log('Forgot password clicked')
}
</script>

<template>
  <GuestLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Login Card -->
      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl p-8">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">
            <span class="text-[#F0AB26]">Si</span><span class="text-[#176BC7]">PEDAGANG</span>
          </h1>
          <p class="text-gray-600 mt-2 text-sm">Silahkan login terlebih dahulu</p>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Error message if any -->
          <div v-if="errorMessage" class=" text-center bg-red-100 text-red-700 p-3 rounded text-sm">
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
          
          <!-- Password field with toggle visibility -->
          <div>
            <label for="password" class="block text-sm text-gray-700 mb-1">Kata Sandi</label>
            <div class="relative">
              <input 
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              />
              <button 
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <!-- Eye icon when password is hidden -->
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Crossed eye icon when password is visible -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Login button -->
          <div>
            <button 
              type="submit" 
              class="w-full bg-[#176BC7] text-white py-2.5 rounded-full font-medium hover:bg-blue-600 transition-colors"
              :disabled="isLoading"
            > 
              <span v-if="isLoading">Loading...</span>
              <span v-else>Login</span>
            </button>
          </div>
          
         <!-- Forgot password link -->
<div class="text-center">
  <router-link 
    to="/admin/resetrequest" 
    class="text-sm text-blue-600 hover:underline"
  >
    Lupa kata sandi?
  </router-link>
</div>
        </form>
      </div>
    </div>
  </GuestLayout>
</template>