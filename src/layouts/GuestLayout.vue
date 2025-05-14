<script setup></script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- SVG Backgrounds -->
    <svg
      class="absolute bottom-0 left-0 w-full z-0"
      width="1919"
      height="298"
      viewBox="0 0 1919 298"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0L52.8 14.1905C107.2 28.381 212.8 56.7619 320 85.1429C427.2 113.524 532.8 141.905 640 177.381C747.2 212.857 852.8 255.429 960 269.619C1067.2 283.81 1172.8 269.619 1280 205.762C1387.2 141.905 1492.8 28.381 1600 14.1905C1707.2 0 1812.8 85.1429 1867.2 127.714L1920 170.286V298H1867.2C1812.8 298 1707.2 298 1600 298C1492.8 298 1387.2 298 1280 298C1172.8 298 1067.2 298 960 298C852.8 298 747.2 298 640 298C532.8 298 427.2 298 320 298C212.8 298 107.2 298 52.8 298H0V0Z"
        fill="#0099FF"
      />
    </svg>
    <svg
      class="absolute top-0 left-0 w-full z-0"
      width="1200"
      height="198"
      viewBox="0 0 1200 198"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1200 0H1133C1067 0 933 0 800 38.4756C667 76.9513 533 153.903 400 182.759C267 211.616 133 192.378 67 182.759L0 173.14V0H67C133 0 267 0 400 0C533 0 667 0 800 0C933 0 1067 0 1133 0H1200Z"
        fill="#F0AB26"
      />
    </svg>
    
    <!-- Content Layer -->
    <div
      class="relative z-10 w-full h-full flex flex-col items-center justify-center"
    >
      <slot />
    </div>
  </div>
</template>
