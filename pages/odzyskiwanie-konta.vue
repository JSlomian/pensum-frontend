<script setup lang="ts">
  definePageMeta({
    layout: 'login',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/',
    },
  })
  const routeString = useRoute()
  const token = routeString.query.t as string
  const sentStatus = ref<boolean>(false)
  const tokenValue = ref<string>(token)
  const hasToken = computed(() => tokenValue.value !== undefined)
  const setStatus = (value: boolean) => (sentStatus.value = value)
</script>

<template>
  <RecoverAccount v-if="hasToken === false && sentStatus === false" @sent="setStatus(true)" />
  <RecoveryEmailSent v-else-if="hasToken === false && sentStatus === true" />
  <ResetPassword v-else-if="hasToken === true && sentStatus === false" :token="tokenValue" />
</template>

<style scoped></style>
