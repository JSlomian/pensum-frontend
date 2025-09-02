<script setup lang="ts">
const { signOut } = useAuth()

async function onLogout() {
  await signOut({ callbackUrl: '/login' })
}
</script>

<template>
  <button
    class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
    @click="onLogout"
  >
    Wyloguj
  </button>
</template>
