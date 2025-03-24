<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Uniwersytet Pomorski Planner Pensum - ${titleChunk}` : 'Uniwersytet Pomorski Planner Pensum';
  },
  htmlAttrs: {
    class: 'dark',
  }
})
</script>

<template>
  <NuxtPage/>
</template>


<style scoped>
</style>
