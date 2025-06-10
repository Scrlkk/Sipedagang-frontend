<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { fetchAdminById } from '@/services/adminService'
  import { fetchAdminList } from '@/services/adminService'
  import {
    createAdmin,
    updateAdmin,
    setAdminInactive,
    setAdminActive,
  } from '@/services/adminService'
  import Swal from 'sweetalert2'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import StaffIconElement from '@/components/StaffIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import StaffAddIconElement from '@/components/StaffAddIconElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import PasswordShowElement from '@/components/PasswordShowElement.vue'
  import PasswordHideElement from '@/components/PasswordHideElement.vue'
  import { Cropper, CircleStencil } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'
  // ✅ Import config environment
  import { config } from '@/config/env'

  const props = defineProps(['id'])
  const iconHover = ref(false)
  const router = useRouter()

  const pageTitle = computed(() =>
    props.id ? 'Management Staff - Edit' : 'Management Staff - Tambah',
  )

  const nama = ref('')
  const namaPengguna = ref('')
  const noTelp = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const showPassword = ref(false)
  const showPasswordConfirmation = ref(false)
  const userStatus = ref('active')
  const originalPasswordExists = ref(false)
  const photoUrl = ref('')
  const photoFile = ref(null)
  const fileInputRef = ref(null)

  // ✅ Advanced Cropper refs
  const showCropper = ref(false)
  const selectedImageSrc = ref('')
  const cropperRef = ref(null)

  // ✅ Tambah ref untuk menyimpan password asli
  const originalPassword = ref('')

  // Computed properties untuk button
  const showDeleteButton = computed(() => !!props.id)

  // ✅ PERBAIKAN: Debug dulu untuk memastikan userStatus
  const deleteButtonLabel = computed(() => {
    console.log('Current userStatus.value:', userStatus.value)
    console.log('props.id:', props.id)

    if (!props.id) return 'Hapus'

    // Debug lebih detail
    const isActive = userStatus.value === 'active'
    const label = isActive ? 'Nonaktifkan' : 'Aktifkan'

    console.log('isActive:', isActive, 'label:', label)
    return label
  })

  const deleteButtonColor = computed(() => {
    if (!props.id) return '#d33'
    return userStatus.value === 'active' ? '#d33' : '#28a745'
  })

  // ✅ Photo upload functions dengan Advanced Cropper
  const triggerFileInput = () => {
    if (fileInputRef.value) {
      fileInputRef.value.click()
    }
  }

  const onPhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Error!',
          text: 'File harus berupa gambar!',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
        return
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Error!',
          text: 'Ukuran file tidak boleh lebih dari 5MB!',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
        return
      }

      // Convert file ke URL untuk cropper
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImageSrc.value = e.target.result
        showCropper.value = true
      }
      reader.readAsDataURL(file)
    }
  }

  // ✅ Advanced Cropper functions
  const saveCroppedImage = () => {
    if (cropperRef.value) {
      const { canvas } = cropperRef.value.getResult()

      canvas.toBlob(
        (blob) => {
          // Create file dari blob
          const croppedFile = new File([blob], `profile_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          // Set sebagai photo file
          photoFile.value = croppedFile

          // Set preview URL
          const reader = new FileReader()
          reader.onload = (e) => {
            photoUrl.value = e.target.result
          }
          reader.readAsDataURL(croppedFile)

          // Tutup cropper
          showCropper.value = false
          selectedImageSrc.value = ''

          Swal.fire({
            title: 'Berhasil!',
            text: 'Foto berhasil diedit!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          })
        },
        'image/jpeg',
        0.9,
      )
    }
  }

  const cancelCrop = () => {
    showCropper.value = false
    selectedImageSrc.value = ''
  }

  // Watch untuk otomatis reset confirmation ketika password berubah
  watch(password, (newPassword, oldPassword) => {
    if (props.id && newPassword !== oldPassword) {
      passwordConfirmation.value = ''
    }
  })

  // ✅ Computed untuk menentukan kapan konfirmasi password muncul
  const shouldShowPasswordConfirmation = computed(() => {
    if (!props.id) {
      return true
    } else {
      return password.value !== originalPassword.value
    }
  })

  // ✅ Computed untuk menentukan apakah password berubah
  const isPasswordChanged = computed(() => {
    if (!props.id) return true
    return password.value !== originalPassword.value
  })

  // Helper function untuk format URL foto
  const getPhotoUrl = (photoPath) => {
    return config.getStorageUrl(photoPath)
  }

  onMounted(async () => {
    if (props.id) {
      try {
        const data = await fetchAdminById(props.id)

        if (!data) throw new Error('not found')

        nama.value = data.name || ''
        namaPengguna.value = data.nama_pengguna || ''
        noTelp.value = data.phone_number || ''
        photoUrl.value = getPhotoUrl(data.profile_photo)

        // ✅ PERBAIKAN: Debug dan pastikan status di-set dengan benar
        console.log('Original status from API:', data.status)
        console.log('Available status values:', Object.keys(data))

        // Handle berbagai kemungkinan field status
        const statusValue = data.status || data.user_status || data.is_active

        // Normalisasi status
        if (
          statusValue === 'active' ||
          statusValue === 1 ||
          statusValue === true
        ) {
          userStatus.value = 'active'
        } else if (
          statusValue === 'inactive' ||
          statusValue === 0 ||
          statusValue === false
        ) {
          userStatus.value = 'inactive'
        } else {
          userStatus.value = 'active' // default
        }

        console.log('Final userStatus.value:', userStatus.value)

        const currentPassword = data.plain_password || data.password || ''
        password.value = currentPassword
        originalPassword.value = currentPassword
        passwordConfirmation.value = currentPassword
        originalPasswordExists.value = !!currentPassword

        console.log('Loaded admin data:', {
          name: data.name,
          username: data.nama_pengguna,
          photoPath: data.profile_photo,
          photoUrl: photoUrl.value,
          hasPassword: !!password.value,
        })
      } catch (e) {
        console.error('Error loading admin data:', e)
        nama.value = ''
        namaPengguna.value = ''
        noTelp.value = ''
        photoUrl.value = ''
        userStatus.value = 'active'
        password.value = ''
        passwordConfirmation.value = ''
        originalPasswordExists.value = false
        Swal.fire({
          title: 'Error!',
          text: 'Data staff tidak ditemukan!',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
      }
    }
  })

  async function handleRight() {
    if (!nama.value || !namaPengguna.value || (!props.id && !password.value)) {
      Swal.fire({
        title: 'Error!',
        text: 'Mohon lengkapi semua field yang diperlukan!',
        icon: 'error',
        confirmButtonColor: '#d33',
      })
      return
    }

    // ✅ Validasi password confirmation - hanya jika password berubah
    if (
      shouldShowPasswordConfirmation.value &&
      password.value !== passwordConfirmation.value
    ) {
      Swal.fire({
        title: 'Error!',
        text: 'Password dan konfirmasi password tidak sama!',
        icon: 'error',
        confirmButtonColor: '#d33',
      })
      return
    }

    try {
      if (props.id) {
        // Edit mode - SELALU gunakan FormData untuk konsistensi
        let updateData = new FormData()
        updateData.append('name', nama.value)
        updateData.append('nama_pengguna', namaPengguna.value)
        updateData.append('phone_number', noTelp.value || '')

        // ✅ Kirim password hanya jika berubah
        if (isPasswordChanged.value) {
          updateData.append('password', password.value)
          updateData.append('password_confirmation', passwordConfirmation.value)
        }

        if (photoFile.value) {
          updateData.append('profile_photo', photoFile.value)
        }

        await updateAdmin(props.id, updateData)

        Swal.fire({
          title: 'Berhasil!',
          text: 'Data staff berhasil diupdate!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      } else {
        // Create mode - gunakan FormData jika ada foto
        let createData

        if (photoFile.value) {
          createData = new FormData()
          createData.append('name', nama.value)
          createData.append('nama_pengguna', namaPengguna.value)
          createData.append('password', password.value)
          createData.append('password_confirmation', passwordConfirmation.value)
          if (noTelp.value.trim()) {
            createData.append('phone_number', noTelp.value)
          }
          createData.append('profile_photo', photoFile.value)
        } else {
          createData = {
            name: nama.value,
            nama_pengguna: namaPengguna.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
          }
          if (noTelp.value.trim()) {
            createData.phone_number = noTelp.value
          }
        }

        await createAdmin(createData)

        Swal.fire({
          title: 'Berhasil!',
          text: 'Staff berhasil ditambahkan!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }

      // Delay redirect untuk memberi waktu user melihat pesan sukses
      setTimeout(() => {
        router.push('/superadmin/staff')
      }, 2000)
    } catch (e) {
      console.error('Error:', e)
      Swal.fire({
        title: 'Error!',
        text: e.response?.data?.message || 'Gagal menyimpan data staff!',
        icon: 'error',
        confirmButtonColor: '#d33',
      })
    }
  }

  function handleLeft() {
    router.back()
  }

  // ✅ TAMBAHKAN: Debug untuk handleDelete
  async function handleDelete() {
    console.log('=== handleDelete Debug ===')
    console.log('props.id:', props.id)
    console.log('userStatus.value:', userStatus.value)

    if (!props.id) return

    const isActive = userStatus.value === 'active'
    console.log('isActive:', isActive)

    const actionText = isActive ? 'nonaktifkan' : 'aktifkan'
    const confirmText = isActive ? 'Ya, Nonaktifkan!' : 'Ya, Aktifkan!'

    console.log('actionText:', actionText)
    console.log('confirmText:', confirmText)

    const result = await Swal.fire({
      title: `Konfirmasi ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      text: `Yakin ingin ${actionText} staff ini?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: confirmText,
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        console.log(
          'Confirmed! Calling:',
          isActive ? 'setAdminInactive' : 'setAdminActive',
        )

        if (isActive) {
          console.log('Calling setAdminInactive with ID:', props.id)
          await setAdminInactive(props.id)
        } else {
          console.log('Calling setAdminActive with ID:', props.id)
          await setAdminActive(props.id)
        }

        Swal.fire({
          title: 'Berhasil!',
          text: `Staff berhasil ${isActive ? 'di-nonaktifkan' : 'diaktifkan'}!`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        })

        // Delay redirect untuk memberi waktu user melihat pesan sukses
        setTimeout(() => {
          router.push('/superadmin/staff')
        }, 2000)
      } catch (e) {
        console.error('handleDelete error:', e)
        Swal.fire({
          title: 'Error!',
          text: `Gagal ${actionText} staff!`,
          icon: 'error',
          confirmButtonColor: '#d33',
        })
      }
    }
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const togglePasswordConfirmationVisibility = () => {
    showPasswordConfirmation.value = !showPasswordConfirmation.value
  }

  const formatPhoneNumber = (event) => {
    let value = event.target.value.replace(/[^0-9]/g, '')

    if (value.length > 15) {
      value = value.slice(0, 15)
    }
    noTelp.value = value
  }
</script>

<template>
  <SuperAdminLayout>
    <MainElement>
      <div class="flex flex-col h-full justify-between">
        <section>
          <!-- TITLE -->
          <div
            class="text-center font-semibold text-lg text-[#0099FF] underline underline-offset-8"
          >
            {{ pageTitle }}
          </div>

          <!-- NAV -->
          <RouterLink to="/superadmin/staff" class="flex gap-2 items-center">
            <div
              @mouseenter="iconHover = true"
              @mouseleave="iconHover = false"
              class="flex gap-2 items-center cursor-pointer"
            >
              <StaffIconElement
                :color="iconHover ? '#0099FF' : '#9BA1AA'"
                :stroke="iconHover ? 'white' : 'white'"
              />
              <div
                :class="[
                  'text-sm font-poppins font-medium',
                  iconHover ? 'text-[#0099FF]' : 'text-[#9BA1AA]',
                ]"
              >
                Staff
              </div>
            </div>
            <div class="mt-0.5">
              <ArrowIconElement />
            </div>
            <div class="text-[#9BA1AA] text-sm font-poppins font-medium">
              {{ props.id ? 'Edit Staff' : 'Tambah Staff' }}
            </div>
          </RouterLink>

          <!-- FORM -->
          <div class="mt-10">
            <form @submit.prevent="handleRight">
              <div class="flex gap-16 w-full">
                <!-- ✅ FOTO dengan Advanced Cropper -->
                <div class="flex flex-col items-center">
                  <div class="relative w-36 h-36">
                    <div
                      class="absolute inset-0 bg-[#9BA1AA] rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-colors"
                    >
                      <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/*"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        @change="onPhotoChange"
                      />
                      <img
                        v-if="photoUrl"
                        :src="photoUrl"
                        alt="Foto Staff"
                        class="object-cover w-full h-full"
                      />
                      <div
                        v-else
                        class="flex items-center justify-center h-full text-gray-500"
                      >
                        <svg
                          class="w-12 h-12"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <StaffAddIconElement
                      @click="triggerFileInput"
                      class="absolute cursor-pointer overflow-visible top-20 left-27 z-20"
                    />
                  </div>
                  <div class="pt-3 w-full text-center text-gray-600">
                    <div class="text-sm font-medium">Upload Your Photo</div>
                    <div class="text-xs text-gray-500 mt-1">
                      Klik untuk upload & edit foto
                    </div>
                  </div>
                </div>

                <!-- INPUT (tetap sama seperti sebelumnya) -->
                <div
                  class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-4 gap-y-3 gap-x-10 w-full"
                >
                  <!-- NAMA Staff -->
                  <div class="flex flex-col gap-2.5">
                    <label for="nama-staff" class="font-medium"
                      >Nama Staff <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      id="nama-staff"
                      placeholder="Masukkan Nama Staff"
                      class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full"
                      v-model="nama"
                      autocomplete="name"
                      required
                    />
                  </div>

                  <!-- NO TELP -->
                  <div class="flex flex-col gap-2.5">
                    <label for="no-telp" class="font-medium">No. Telp </label>
                    <input
                      type="text"
                      id="no-telp"
                      placeholder="08XX-XXXX-XXXX"
                      class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full"
                      v-model="noTelp"
                      autocomplete="tel"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      @input="formatPhoneNumber"
                      maxlength="15"
                    />
                  </div>

                  <!-- NAMA PENGGUNA -->
                  <div class="flex flex-col gap-2.5">
                    <label for="nama-pengguna" class="font-medium"
                      >Nama Pengguna <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      id="nama-pengguna"
                      placeholder="Masukkan Nama Pengguna"
                      class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full"
                      v-model="namaPengguna"
                      autocomplete="username"
                      required
                    />
                  </div>

                  <!-- PASSWORD -->
                  <div class="flex flex-col gap-2.5">
                    <label for="password" class="font-medium">
                      Password <span class="text-red-500">*</span>
                      <span
                        v-if="props.id && !isPasswordChanged"
                        class="text-green-600 text-sm"
                      >
                        (password saat ini)
                      </span>
                      <span
                        v-if="props.id && isPasswordChanged"
                        class="text-orange-500 text-sm"
                      >
                        (password baru)
                      </span>
                    </label>
                    <div class="relative">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        :placeholder="
                          props.id
                            ? 'Edit password atau biarkan sama'
                            : 'Masukkan Password'
                        "
                        class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full pr-10"
                        v-model="password"
                        autocomplete="current-password"
                        required
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                        @click="togglePasswordVisibility"
                      >
                        <PasswordShowElement v-if="!showPassword" />
                        <PasswordHideElement v-else />
                      </span>
                    </div>
                  </div>

                  <!-- PASSWORD CONFIRMATION - Hanya tampil jika diperlukan -->
                  <div
                    class="flex flex-col gap-2.5"
                    v-if="shouldShowPasswordConfirmation"
                  >
                    <label for="password-confirmation" class="font-medium">
                      Konfirmasi Password <span class="text-red-500">*</span>
                      <span v-if="props.id" class="text-orange-500 text-sm">
                        (ulangi password baru)
                      </span>
                    </label>
                    <div class="relative">
                      <input
                        :type="showPasswordConfirmation ? 'text' : 'password'"
                        id="password-confirmation"
                        placeholder="Ulangi Password"
                        class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full pr-10"
                        v-model="passwordConfirmation"
                        autocomplete="new-password"
                        required
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                        @click="togglePasswordConfirmationVisibility"
                      >
                        <PasswordShowElement v-if="!showPasswordConfirmation" />
                        <PasswordHideElement v-else />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>

        <!-- BUTTON -->
        <section>
          <ButtonElement
            left-label="Back"
            :show-delete="showDeleteButton"
            :delete-label="deleteButtonLabel"
            @onClickDelete="handleDelete"
            @onClickLeft="handleLeft"
            @onClickRight="handleRight"
          />
        </section>
      </div>
    </MainElement>

    <!-- ✅ Advanced Cropper Modal -->
    <div
      v-if="showCropper"
      class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out delay-100"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div class="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Edit Foto Profile
          </h3>

          <!-- Cropper -->
          <div class="cropper-container mb-4" style="height: 400px">
            <Cropper
              ref="cropperRef"
              :src="selectedImageSrc"
              :stencil-component="CircleStencil"
              :stencil-props="{
                aspectRatio: 1,
              }"
              class="cropper"
            />
          </div>

          <!-- Modal Buttons -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="cancelCrop"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              @click="saveCroppedImage"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </SuperAdminLayout>
</template>

<style scoped>
  .cropper-container {
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
  }
</style>
