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

<style scoped>
/* Base container styling */
.main-container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Main card styling */
.main-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff !important; /* Force white background */
  border: 1px solid rgba(229, 231, 235, 0.6);
  min-height: 0;
}

/* Content wrapper ensures proper flex behavior */
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  position: relative;
}

/* Scrollable content area */
.scrollable-content {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Enhanced scrollbar styling */
.scrollbar-enhanced::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.scrollbar-enhanced::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
  margin: 2px;
}

.scrollbar-enhanced::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.6);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.scrollbar-enhanced::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.8);
  width: 6px;
}

/* Responsive scrollbar adjustments */
@media (min-width: 640px) {
  .scrollbar-enhanced::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-thumb:hover {
    width: 8px;
  }
}

@media (min-width: 1024px) {
  .scrollbar-enhanced::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-thumb:hover {
    width: 10px;
  }
}

@media (min-width: 1536px) {
  .scrollbar-enhanced::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

/* Firefox scrollbar support */
.scrollbar-enhanced {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.6) rgba(241, 245, 249, 0.5);
}

/* Mobile-first optimizations */
@media (max-width: 639px) {
  .main-container {
    padding-top: max(8px, env(safe-area-inset-top));
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    min-height: 100vh;
    min-height: 100svh; /* Small viewport height for mobile */
  }
  
  .main-card {
    margin: 0 !important;
    border-radius: 12px !important;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Hide scrollbar on mobile for cleaner UI */
  .scrollbar-enhanced {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .scrollbar-enhanced::-webkit-scrollbar {
    display: none;
  }
}

/* Tablet optimizations */
@media (min-width: 640px) and (max-width: 1023px) {
  .main-card {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .main-card {
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1), 
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(0, 0, 0, 0.05);
  }
  
  .main-card:hover {
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.15), 
      0 15px 15px -5px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
}

/* Ultra-wide desktop optimization */
@media (min-width: 1536px) {
  .main-container {
    max-width: 1920px;
    margin: 0 auto;
  }
}

/* Smooth scrolling behavior */
.scrollbar-enhanced {
  scroll-behavior: smooth;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .scrollbar-enhanced {
    scroll-behavior: auto;
  }
  
  .main-card {
    transition: none;
  }
  
  .main-card:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .main-card {
    border: 2px solid #374151;
    background: white;
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-thumb {
    background: #374151;
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-track {
    background: #e5e7eb;
  }
}

/* Dark mode support (disabled untuk sekarang) */
/* 
@media (prefers-color-scheme: dark) {
  .main-card {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(75, 85, 99, 0.6);
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.6);
  }
  
  .scrollbar-enhanced::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.5);
  }
}
*/

/* Focus improvements for keyboard navigation */
.scrollable-content:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ensure content doesn't shrink inappropriately */
.content-wrapper > * {
  flex-shrink: 0;
}

/* Better responsive behavior for very small screens */
@media (max-width: 374px) {
  .main-container {
    padding: 4px !important;
  }
  
  .main-card {
    padding: 8px !important;
    border-radius: 8px !important;
  }
}

/* Large tablet landscape optimization */
@media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape) {
  .main-container {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
</style>
