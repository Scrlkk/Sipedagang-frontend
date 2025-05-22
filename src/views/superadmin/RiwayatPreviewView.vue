<script setup>
  import { useRouter } from 'vue-router'
  import SuperadminLayout from '@/layouts/SuperadminLayout.vue'
  import MainElement from '@/components/MainElement.vue'
  import ButtonElement from '@/components/ButtonElement.vue'
  import RiwayatPreviewElement from '../../components/RiwayatPreviewElement.vue'

  const props = defineProps(['id'])
  const router = useRouter()

  function handleLeft() {
    router.back()
  }
  function handleRight() {
    // Handle the right button click
  }
</script>

<template>
  <SuperadminLayout>
    <MainElement>
      <section class="flex flex-col h-full justify-between">
        <!-- TITLE -->
        <div
          class="font-semibold text-center text-lg text-[#0099FF] underline underline-offset-8"
        >
          Preview Data Pengadaan - {{ id }}
        </div>

        <!-- PDF -->
        <RiwayatPreviewElement />

        <!-- BUTTON -->
        <ButtonElement
          left-label="Back"
          right-label="Cetak"
          @onClickLeft="handleLeft"
          @onClickRight="handleRight"
        />
      </section>
    </MainElement>
  </SuperadminLayout>
</template>
