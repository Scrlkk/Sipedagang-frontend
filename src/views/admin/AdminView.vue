<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
    <AdminLayout class="h-screen overflow-hidden">
       <div class="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-4 overflow-hidden">
            <!-- Welcome Message -->
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-20 text-center font-inter">
                Halo, Selamat Datang Ahmad Kaisar
            </h1>
            
            <!-- Dashboard Cards - with fixed dimensions -->
            <div class="flex flex-col md:flex-row gap-4 justify-center w-full">
                
                <!-- Form Input Data Card -->
                <RouterLink to="/form" class="block w-full md:w-auto mx-auto">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:scale-102 hover:shadow-lg cursor-pointer h-[469px] w-full md:w-[455px]">
                        <div class="h-[369px] overflow-hidden">
                            <img 
                                src="@/assets/images/input-data.png" 
                                alt="Form Input" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div class="p-6 flex items-center justify-center h-[100px]">
                            <h3 class="text-xl md:text-2xl font-bold text-center font-inter">Form Input Data</h3>
                        </div>
                    </div>
                </RouterLink>
                
                <!-- Rekap Data Card -->
                <RouterLink to="/lihatdata" class="block w-full md:w-auto mx-auto">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:scale-102 hover:shadow-lg cursor-pointer h-[469px] w-full md:w-[455px]">
                        <div class="h-[369px] overflow-hidden">
                            <img 
                                src="@/assets/images/rekap-data.png" 
                                alt="Rekap Data" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div class="p-6 flex items-center justify-center h-[100px]">
                            <h3 class="text-xl md:text-2xl font-bold text-center font-inter">Rekap Data</h3>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>