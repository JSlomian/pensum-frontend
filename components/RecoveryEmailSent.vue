<script setup lang="ts">
  setTimeout(() => {
    navigateTo('/login')
  }, 5000)
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <NuxtLink
        to="/"
        class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="mr-4 h-16 w-24 p-2"
          style="background: aliceblue"
          src="/logo.svg"
          alt="Logo UPSL"
        />
        Pensum
      </NuxtLink>
      <div
        class="bg-gray-50-white w-full rounded-lg p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0"
      >
        <h1
          class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
        >
          Email wysłany
        </h1>
        <p class="font-light text-gray-500 dark:text-gray-400">Sprawdź skrzynkę pocztową</p>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped></style>
