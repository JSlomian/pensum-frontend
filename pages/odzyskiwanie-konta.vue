<script lang="ts">
definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
</script>

<template>
  <RecoverAccount/>
  <ResetPassword/>
</template>

<style scoped>

</style>