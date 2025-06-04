<script setup>
  import { ref } from 'vue'

  const emit = defineEmits(['toggle-view'])

  const isKuitansiMode = ref(false)

  const printPage = () => {
    window.print()
  }

  const backRoute = () => {
    window.close()
  }

  const toggleToSuratMode = () => {
    isKuitansiMode.value = false
    emit('toggle-view', 'surat')
  }

  const toggleToKuitansiMode = () => {
    isKuitansiMode.value = true
    emit('toggle-view', 'kuitansi')
  }
</script>
<template>
  <div
    class="flex flex-col gap-y-7 fixed top-[12rem] left-15 z-50 scale-80 bg-[#9ba1aa2f] outline outline-gray-200 p-4 rounded-[5rem] shadow-lg"
  >
    <button
      class="cursor-pointer hover:scale-75 transition-all duration-200 ease-in-out"
      @click="backRoute"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#0099FF" />
        <path
          d="M32 48H72C72.5304 48 73.0391 48.2107 73.4142 48.5858C73.7893 48.9609 74 49.4696 74 50C74 50.5304 73.7893 51.0391 73.4142 51.4142C73.0391 51.7893 72.5304 52 72 52H32C31.4696 52 30.9609 51.7893 30.5858 51.4142C30.2107 51.0391 30 50.5304 30 50C30 49.4696 30.2107 48.9609 30.5858 48.5858C30.9609 48.2107 31.4696 48 32 48Z"
          fill="white"
        />
        <path
          d="M32.8279 50L49.4159 66.584C49.7915 66.9595 50.0024 67.4689 50.0024 68C50.0024 68.5311 49.7915 69.0404 49.4159 69.416C49.0404 69.7915 48.531 70.0025 47.9999 70.0025C47.4688 70.0025 46.9595 69.7915 46.5839 69.416L28.5839 51.416C28.3977 51.2302 28.2499 51.0095 28.1491 50.7665C28.0482 50.5235 27.9963 50.2631 27.9963 50C27.9963 49.7369 28.0482 49.4764 28.1491 49.2335C28.2499 48.9905 28.3977 48.7698 28.5839 48.584L46.5839 30.584C46.9595 30.2084 47.4688 29.9975 47.9999 29.9975C48.531 29.9975 49.0404 30.2084 49.4159 30.584C49.7915 30.9595 50.0024 31.4689 50.0024 32C50.0024 32.5311 49.7915 33.0404 49.4159 33.416L32.8279 50Z"
          fill="white"
        />
      </svg>
    </button>
    <button
      class="cursor-pointer hover:scale-75 transition-all duration-200 ease-in-out"
      @click="printPage"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#0099FF" />
        <path
          d="M37.9978 65.5C32.5131 65.5 29.7707 65.5 27.8183 64.3293C26.5422 63.5641 25.5142 62.47 24.8507 61.1709C23.8355 59.183 24.1084 56.5547 24.6542 51.2981C25.1097 46.9101 25.3375 44.7159 26.4578 43.1046C27.1932 42.0467 28.1879 41.1796 29.354 40.58C31.1301 39.6667 33.4193 39.6667 37.9978 39.6667H62.0023C66.581 39.6667 68.87 39.6667 70.6461 40.58C71.8122 41.1796 72.807 42.0467 73.5425 43.1046C74.6627 44.7159 74.8905 46.9101 75.3459 51.2981C75.8918 56.5547 76.1646 59.183 75.1494 61.1709C74.486 62.47 73.458 63.5641 72.1819 64.3293C70.2294 65.5 67.4872 65.5 62.0023 65.5"
          stroke="#F7F8FA"
          stroke-width="4"
        />
        <path
          d="M62.9166 39.6667V34.5C62.9166 29.6288 62.9166 27.1932 61.4033 25.68C59.89 24.1667 57.4544 24.1667 52.5833 24.1667H47.4166C42.5454 24.1667 40.1098 24.1667 38.5965 25.68C37.0833 27.1932 37.0833 29.6288 37.0833 34.5V39.6667"
          stroke="#F7F8FA"
          stroke-width="4"
          stroke-linejoin="round"
        />
        <path
          d="M55.1374 60.3333H44.8624C43.0921 60.3333 42.207 60.3333 41.4538 60.6146C40.4496 60.9895 39.5898 61.718 39.0109 62.6839C38.5768 63.4085 38.3621 64.3403 37.9328 66.2037C37.2618 69.1154 36.9264 70.5711 37.1545 71.7385C37.4587 73.2949 38.4069 74.6124 39.7248 75.3099C40.7132 75.8333 42.0963 75.8333 44.8624 75.8333H55.1374C57.9036 75.8333 59.2867 75.8333 60.2751 75.3099C61.5929 74.6124 62.5412 73.2949 62.8453 71.7385C63.0734 70.5711 62.7381 69.1154 62.0672 66.2037C61.6378 64.3403 61.4229 63.4085 60.9889 62.6839C60.41 61.718 59.5502 60.9895 58.5461 60.6146C57.7928 60.3333 56.9078 60.3333 55.1374 60.3333Z"
          stroke="#F7F8FA"
          stroke-width="4"
          stroke-linejoin="round"
        />
        <path
          d="M65.5 50H65.5224"
          stroke="#F7F8FA"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      v-if="isKuitansiMode"
      @click="toggleToSuratMode"
      class="cursor-pointer hover:scale-75 transition-all duration-200 ease-in-out"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#0099FF" />
        <path
          d="M57.375 27.7292V31.1667C57.375 34.4076 57.375 36.028 58.3817 37.0349C59.3887 38.0417 61.0091 38.0417 64.25 38.0417H67.6875"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M32.1667 58.6666V40.3333C32.1667 33.8515 32.1667 30.6106 34.1804 28.597C36.194 26.5833 39.4349 26.5833 45.9167 26.5833H55.4767C56.4133 26.5833 56.8817 26.5833 57.3029 26.7578C57.7239 26.9322 58.0552 27.2634 58.7175 27.9257L67.491 36.6992C68.1532 37.3616 68.4846 37.6928 68.659 38.1139C68.8334 38.535 68.8334 39.0034 68.8334 39.9401V58.6666C68.8334 65.1484 68.8334 68.3893 66.8197 70.403C64.806 72.4166 61.5652 72.4166 55.0834 72.4166H45.9167C39.4349 72.4166 36.194 72.4166 34.1804 70.403C32.1667 68.3893 32.1667 65.1484 32.1667 58.6666Z"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M41.3333 47.2083H59.6666M41.3333 54.0833H59.6666M41.3333 60.9583H50.8913"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      v-if="!isKuitansiMode"
      class="cursor-pointer hover:scale-75 transition-all duration-200 ease-in-out"
      @click="toggleToKuitansiMode"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#F0AB26" />
        <path
          d="M32.1667 64.7299V40.4577C32.1667 33.9172 32.1667 30.647 34.1804 28.6152C36.194 26.5833 39.4349 26.5833 45.9167 26.5833H55.0834C61.5652 26.5833 64.806 26.5833 66.8197 28.6152C68.8334 30.647 68.8334 33.9172 68.8334 40.4577V64.7299C68.8334 68.1943 68.8334 69.9263 67.7747 70.6081C66.0447 71.7225 63.3703 69.3857 62.0251 68.5375C60.9136 67.8365 60.3581 67.4861 59.7412 67.466C59.0748 67.444 58.5092 67.7801 57.3084 68.5375L52.9292 71.2992C51.7479 72.044 51.1573 72.4166 50.5001 72.4166C49.8428 72.4166 49.2523 72.044 48.0709 71.2992L43.6918 68.5375C42.5804 67.8365 42.0247 67.4861 41.408 67.466C40.7415 67.444 40.176 67.7801 38.975 68.5375C37.63 69.3857 34.9554 71.7225 33.2254 70.6081C32.1667 69.9263 32.1667 68.1943 32.1667 64.7299Z"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M48.2083 47.2083H41.3333"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M55.0833 38.0417H41.3333"
          stroke="white"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>
