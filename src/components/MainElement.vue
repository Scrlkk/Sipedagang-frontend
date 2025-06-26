<script setup></script>

<template>
  <section 
    class="main-container flex flex-col h-full w-full"
    :class="{
      'px-3 py-2': true,
      'sm:px-4 sm:py-3': true,
      'md:px-6 md:py-4': true,
      'lg:px-8 lg:py-6': true,
      'xl:px-10 xl:py-6': true,
      '2xl:px-12 2xl:py-8': true
    }"
  >
    <div class="flex justify-center items-start w-full h-full min-h-0 flex-1">
      <div
        class="main-card shadow-md bg-white rounded-lg flex flex-col transition-all duration-200 ease-in-out"
        style="background-color: #ffffff !important; min-height: 0; height: 100%;"
        :class="{
          'w-full max-w-md mx-2 px-3 py-3 rounded-md': true,
          'sm:max-w-3xl sm:mx-3 sm:px-4 sm:py-4 sm:rounded-lg': true,
          'md:max-w-4xl md:mx-4 md:px-5 md:py-5 md:rounded-xl': true,
          'lg:max-w-5xl lg:mx-6 lg:px-6 lg:py-6': true,
          'xl:max-w-6xl xl:mx-8 xl:px-8 xl:py-7': true,
          '2xl:max-w-7xl 2xl:mx-10 2xl:px-10 2xl:py-8': true
        }"
      >
        <div 
          class="content-wrapper h-full w-full flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div 
            class="scrollable-content h-full w-full overflow-y-auto overflow-x-hidden scrollbar-enhanced"
            style="flex: 1 1 auto; min-height: 0;"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
