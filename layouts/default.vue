<script setup lang="ts">
import {initFlowbite} from 'flowbite'

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

onMounted(() => {
  initFlowbite()
})
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


