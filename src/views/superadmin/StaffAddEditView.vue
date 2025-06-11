<script setup>
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  import { fetchAdminById } from '@/services/adminService'
  import {
    createAdmin,
    updateAdmin,
    setAdminInactive,
    setAdminActive,
  } from '@/services/adminService'
  import { config } from '@/config/env'
  import { Cropper, CircleStencil } from 'vue-advanced-cropper'
  import Swal from 'sweetalert2'
  import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import StaffIconElement from '@/components/StaffIconElement.vue'
  import ArrowIconElement from '@/components/ArrowIconElement.vue'
  import StaffAddIconElement from '@/components/StaffAddIconElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import PasswordShowElement from '@/components/PasswordShowElement.vue'
  import PasswordHideElement from '@/components/PasswordHideElement.vue'
  import 'vue-advanced-cropper/dist/style.css'

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

  const showCropper = ref(false)
  const selectedImageSrc = ref('')
  const cropperRef = ref(null)

  const originalPassword = ref('')

  const showDeleteButton = computed(() => !!props.id)

  const deleteButtonLabel = computed(() => {
    console.log('Current userStatus.value:', userStatus.value)
    console.log('props.id:', props.id)

    if (!props.id) return 'Hapus'

    const isActive = userStatus.value === 'active'
    const label = isActive ? 'Nonaktifkan' : 'Aktifkan'

    console.log('isActive:', isActive, 'label:', label)
    return label
  })

  const triggerFileInput = () => {
    if (fileInputRef.value) {
      fileInputRef.value.click()
    }
  }

  const onPhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Error!',
          text: 'File harus berupa gambar!',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Error!',
          text: 'Ukuran file tidak boleh lebih dari 5MB!',
          icon: 'error',
          confirmButtonColor: '#d33',
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImageSrc.value = e.target.result
        showCropper.value = true
      }
      reader.readAsDataURL(file)
    }
  }

  const saveCroppedImage = () => {
    if (cropperRef.value) {
      const { canvas } = cropperRef.value.getResult()

      canvas.toBlob(
        (blob) => {
          const croppedFile = new File([blob], `profile_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          photoFile.value = croppedFile

          const reader = new FileReader()
          reader.onload = (e) => {
            photoUrl.value = e.target.result
          }
          reader.readAsDataURL(croppedFile)

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

  watch(password, (newPassword, oldPassword) => {
    if (props.id && newPassword !== oldPassword) {
      passwordConfirmation.value = ''
    }
  })

  const shouldShowPasswordConfirmation = computed(() => {
    if (!props.id) {
      return true
    } else {
      return password.value !== originalPassword.value
    }
  })

  const isPasswordChanged = computed(() => {
    if (!props.id) return true
    return password.value !== originalPassword.value
  })

  const getPhotoUrl = (photoPath) => {
    return config.getStorageUrl(photoPath)
  }

  // ✅ Tambahkan state untuk tracking perubahan
  const hasUnsavedChanges = ref(false)
  const initialFormData = ref({})

  // ✅ Fungsi untuk menyimpan data awal
  const saveInitialData = () => {
    initialFormData.value = {
      nama: nama.value,
      namaPengguna: namaPengguna.value,
      noTelp: noTelp.value,
      password: password.value,
      photoUrl: photoUrl.value,
    }
    hasUnsavedChanges.value = false
  }

  // ✅ Fungsi untuk cek apakah ada perubahan
  const checkForChanges = () => {
    const currentData = {
      nama: nama.value,
      namaPengguna: namaPengguna.value,
      noTelp: noTelp.value,
      password: password.value,
      photoUrl: photoUrl.value,
    }

    hasUnsavedChanges.value =
      JSON.stringify(currentData) !== JSON.stringify(initialFormData.value)
  }

  // ✅ Watch untuk perubahan form
  watch(
    [nama, namaPengguna, noTelp, password, photoUrl],
    () => {
      checkForChanges()
    },
    { deep: true },
  )

  // ✅ Fungsi konfirmasi sebelum meninggalkan halaman
  const confirmLeave = async () => {
    if (!hasUnsavedChanges.value) return true

    const result = await Swal.fire({
      title: 'Perubahan Belum Disimpan!',
      text: 'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Tinggalkan',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    return result.isConfirmed
  }

  // ✅ Guard untuk navigasi Vue Router
  onBeforeRouteLeave(async (to, from) => {
    const canLeave = await confirmLeave()
    if (!canLeave) {
      return false // Batalkan navigasi
    }
  })

  // ✅ Guard untuk browser navigation (refresh, close tab, etc.)
  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault()
      event.returnValue =
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?'
      return event.returnValue
    }
  }

  // ✅ Lifecycle hooks
  onMounted(async () => {
    // Add beforeunload listener
    window.addEventListener('beforeunload', handleBeforeUnload)

    if (props.id) {
      try {
        const data = await fetchAdminById(props.id)

        if (!data) throw new Error('not found')

        nama.value = data.name || ''
        namaPengguna.value = data.nama_pengguna || ''
        noTelp.value = data.phone_number || ''
        photoUrl.value = getPhotoUrl(data.profile_photo)

        console.log('Original status from API:', data.status)
        console.log('Available status values:', Object.keys(data))

        const statusValue = data.status || data.user_status || data.is_active

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
          userStatus.value = 'active'
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
          phone: data.phone_number,
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
    } else {
      // ✅ Untuk mode create, simpan data kosong sebagai initial
      setTimeout(() => {
        saveInitialData()
      }, 100)
    }
  })

  onBeforeUnmount(() => {
    // Remove beforeunload listener
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const togglePasswordConfirmationVisibility = () => {
    showPasswordConfirmation.value = !showPasswordConfirmation.value
  }

  const formatPhoneNumber = (event) => {
    // ✅ Allow numbers, +, and - for international phone numbers
    let value = event.target.value.replace(/[^0-9+\-]/g, '')

    // ✅ Ensure + only appears at the beginning
    if (value.includes('+')) {
      const parts = value.split('+')
      if (parts[0] === '') {
        // + is at the beginning, keep only the first +
        value = '+' + parts.slice(1).join('').replace(/\+/g, '')
      } else {
        // + is not at the beginning, remove all +
        value = value.replace(/\+/g, '')
      }
    }

    // ✅ Limit total length (including + and -)
    if (value.length > 20) {
      value = value.slice(0, 20)
    }

    noTelp.value = value === '' ? '' : value
  }

  const displayPhoneNumber = computed({
    get: () => noTelp.value || '',
    set: (value) => {
      noTelp.value = value.trim() === '' ? '' : value
    },
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
        let updateData = new FormData()
        updateData.append('name', nama.value)
        updateData.append('nama_pengguna', namaPengguna.value)

        const phoneValue =
          noTelp.value && noTelp.value.trim() !== '' ? noTelp.value.trim() : ''
        updateData.append('phone_number', phoneValue)

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
        let createData

        const phoneValue =
          noTelp.value && noTelp.value.trim() !== '' ? noTelp.value.trim() : ''

        if (photoFile.value) {
          createData = new FormData()
          createData.append('name', nama.value)
          createData.append('nama_pengguna', namaPengguna.value)
          createData.append('password', password.value)
          createData.append('password_confirmation', passwordConfirmation.value)
          createData.append('phone_number', phoneValue)
          createData.append('profile_photo', photoFile.value)
        } else {
          createData = {
            name: nama.value,
            nama_pengguna: namaPengguna.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
            phone_number: phoneValue,
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

      // ✅ Reset unsaved changes setelah berhasil save
      hasUnsavedChanges.value = false

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

  // ✅ Update handleLeft untuk konfirmasi
  async function handleLeft() {
    const canLeave = await confirmLeave()
    if (canLeave) {
      router.back()
    }
  }

  // ✅ Update handleDelete untuk reset unsaved changes
  async function handleDelete() {
    console.log('=== handleDelete Debug ===')
    console.log('props.id:', props.id)
    console.log('userStatus.value:', userStatus.value)
    console.log('hasUnsavedChanges.value:', hasUnsavedChanges.value)

    if (!props.id) return

    const isActive = userStatus.value === 'active'
    const actionText = isActive ? 'nonaktifkan' : 'aktifkan'
    const confirmText = isActive ? 'Ya, Nonaktifkan!' : 'Ya, Aktifkan!'

    // ✅ Cek apakah ada perubahan yang belum disimpan
    let confirmMessage = `Yakin ingin ${actionText} staff ini?`
    if (hasUnsavedChanges.value) {
      confirmMessage = `Ada perubahan yang belum disimpan. Sistem akan menyimpan perubahan terlebih dahulu, kemudian ${actionText} staff ini. Lanjutkan?`
    }

    const result = await Swal.fire({
      title: `Konfirmasi ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      text: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: confirmText,
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        // ✅ Jika ada perubahan yang belum disimpan, simpan dulu
        if (hasUnsavedChanges.value) {
          // Validasi input sebelum save
          if (
            !nama.value ||
            !namaPengguna.value ||
            (!props.id && !password.value)
          ) {
            Swal.fire({
              title: 'Error!',
              text: 'Mohon lengkapi semua field yang diperlukan sebelum mengubah status!',
              icon: 'error',
              confirmButtonColor: '#d33',
            })
            return
          }

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

          // Tampilkan loading untuk save
          Swal.fire({
            title: 'Menyimpan perubahan...',
            text: 'Mohon tunggu',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          // Lakukan save data
          let updateData = new FormData()
          updateData.append('name', nama.value)
          updateData.append('nama_pengguna', namaPengguna.value)

          const phoneValue =
            noTelp.value && noTelp.value.trim() !== ''
              ? noTelp.value.trim()
              : ''
          updateData.append('phone_number', phoneValue)

          if (isPasswordChanged.value) {
            updateData.append('password', password.value)
            updateData.append(
              'password_confirmation',
              passwordConfirmation.value,
            )
          }

          if (photoFile.value) {
            updateData.append('profile_photo', photoFile.value)
          }

          await updateAdmin(props.id, updateData)

          // Reset unsaved changes setelah berhasil save
          hasUnsavedChanges.value = false

          // Update initial data dengan data terbaru
          saveInitialData()

          console.log(
            '✅ Data berhasil disimpan, melanjutkan perubahan status...',
          )
        }

        // ✅ Tampilkan loading untuk perubahan status
        Swal.fire({
          title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} staff...`,
          text: 'Mohon tunggu',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Lakukan perubahan status
        console.log(
          'Calling:',
          isActive ? 'setAdminInactive' : 'setAdminActive',
        )

        if (isActive) {
          console.log('Calling setAdminInactive with ID:', props.id)
          await setAdminInactive(props.id)
        } else {
          console.log('Calling setAdminActive with ID:', props.id)
          await setAdminActive(props.id)
        }

        // ✅ Tampilkan pesan sukses yang mencakup save + status change
        const successMessage = hasUnsavedChanges.value
          ? `Data berhasil disimpan dan staff berhasil ${isActive ? 'di-nonaktifkan' : 'diaktifkan'}!`
          : `Staff berhasil ${isActive ? 'di-nonaktifkan' : 'diaktifkan'}!`

        Swal.fire({
          title: 'Berhasil!',
          text: successMessage,
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        })

        setTimeout(() => {
          router.push('/superadmin/staff')
        }, 2500)
      } catch (e) {
        console.error('handleDelete error:', e)

        // ✅ Pesan error yang lebih spesifik
        let errorMessage = `Gagal ${actionText} staff!`

        if (hasUnsavedChanges.value) {
          // Jika ada error, mungkin saat save atau saat change status
          if (e.message && e.message.includes('validation')) {
            errorMessage =
              'Gagal menyimpan perubahan! Periksa kembali data yang dimasukkan.'
          } else {
            errorMessage = `Perubahan berhasil disimpan, tetapi gagal ${actionText} staff!`
          }
        }

        Swal.fire({
          title: 'Error!',
          text: e.response?.data?.message || errorMessage,
          icon: 'error',
          confirmButtonColor: '#d33',
        })
      }
    }
  }
</script>

<template>
  <SuperAdminLayout>
    <MainElement>
      <div class="flex flex-col h-full justify-between">
        <section>
          <!-- TITLE -->
          <div
            class="text-center font-semibold text-lg text-[#0099FF] underline underline-offset-8 relative"
          >
            {{ pageTitle }}
            <!-- ✅ Indikator unsaved changes -->
            <span
              v-if="hasUnsavedChanges"
              class="absolute -top-1 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"
              title="Ada perubahan yang belum disimpan"
            ></span>
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
                <!-- FOTO -->
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

                <!-- INPUT  -->
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
                      placeholder="Masukkan Nomor Telepon"
                      class="border-[2.2px] border-[#D9D9D9] rounded-lg h-11.5 px-7 w-full"
                      v-model="displayPhoneNumber"
                      autocomplete="tel"
                      pattern="[0-9+\-]*"
                      inputmode="tel"
                      @input="formatPhoneNumber"
                      maxlength="20"
                      title="Masukkan nomor telepon (dapat menggunakan + dan - untuk format internasional)"
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

                  <!-- PASSWORD CONFIRMATION  -->
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

    <!-- Cropper Model -->
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
