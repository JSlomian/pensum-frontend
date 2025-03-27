<script setup lang="ts">

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Uniwersytet Pomorski Planner Pensum - ${titleChunk}` : 'Uniwersytet Pomorski Planner Pensum';
  },
  htmlAttrs: {
    class: 'dark',
  },
  bodyAttrs: {
    class: 'bg-white dark:bg-gray-900'
  }
})

// onErrorCaptured((err, instance, info) => {
//   showToast('danger', info)
// })
</script>
<template>
  <nav>
    <NavBar/>
  </nav>
  <main>
    <NuxtPage/>
  </main>
  <Toaster/>
</template>


