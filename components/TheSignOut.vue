<script setup lang="ts">
  const { signOut } = useAuth()

  async function onLogout() {
    await signOut({ callbackUrl: '/login' })
  }
</script>

<template>
  <button
    class="rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:px-5 md:py-2.5"
    @click="onLogout"
  >
    Wyloguj
  </button>
</template>
