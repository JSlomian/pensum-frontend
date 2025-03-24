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

onMounted(() => {
  setTimeout(() => {
    showToast('success', '', 5000)
  }, 1000)
  setTimeout(() => {
    showToast('success', '', 5000)
  }, 1500)
  setTimeout(() => {
    showToast('success', '', 5000)
  }, 1200)
  setTimeout(() => {
    showToast('success', '', 5000)
  }, 1000)
  setTimeout(() => {
    showToast('success', '', 5000)
  }, 1000)
})
</script>
<template>
  <nav>
    <NewNav/>
  </nav>
  <main>
    <NuxtPage/>
  </main>
  <Toaster/>
</template>


