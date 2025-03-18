<script setup lang="ts">

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Uniwersytet Pomorski Planner Pensum - ${titleChunk}` : 'Uniwersytet Pomorski Planner Pensum';
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
<div class="min-h-full">
<NewNav />

  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>
</div>
  <Toaster />
</template>


