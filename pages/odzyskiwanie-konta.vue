<script setup lang="ts">
definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
const routeString = useRoute()
const token = routeString.query.t
const sentStatus = ref<boolean>(false)
const tokenValue = ref<string>(token)
const hasToken = computed(() => tokenValue.value !== undefined)
const setStatus = (value: boolean) => sentStatus.value = value
console.log('token:', tokenValue.value)
console.log('hasToken:', hasToken.value)
console.log('sentStatus:', sentStatus.value)
</script>

<template>
  <RecoverAccount @sent="setStatus(true)" v-if="hasToken === false && sentStatus === false" />
  <RecoveryEmailSent v-else-if="hasToken === false && sentStatus === true" />
  <ResetPassword v-else-if="hasToken === true && sentStatus === false"/>
</template>

<style scoped>

</style>
