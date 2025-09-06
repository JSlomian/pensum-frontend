<script setup lang="ts">
  const props = defineProps({
    token: {
      default: '',
      required: false,
      type: String,
    },
  })

  const sendButtonActive = ref<boolean>(true)
  const pass1 = ref<string>('')
  const pass2 = ref<string>('')
  const handleForm = async (): Promise<void> => {
    sendButtonActive.value = false
    const route = `/api/reset-password/reset/${props.token}`
    await usePost(route).callPost(
      {
        plainPassword: pass1.value,
      },
      {
        onResponse({ response }: { response: Response }) {
          if (response.ok) {
            showToast('success', 'Hasło zmienione')
            setTimeout(() => {
              navigateTo('/login')
            }, 4000)
          }
        },
        onResponseError({ response }: { response: Response }) {
          if (response.status === 400) {
            showToast('danger', 'Brak tokenu')
            return
          }
          if (response.status === 409) {
            showToast('danger', 'Błąd walidacji tokenu')
            return
          }
          showToast('danger', 'Wystąpił błąd.')
        },
      }
    )
  }
  const isSubmitDisabled = computed(
    () => !pass1.value || !pass2.value || pass1.value !== pass2.value || !sendButtonActive.value
  )
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
        class="w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0"
      >
        <h2
          class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
        >
          Zmień hasło
        </h2>
        <form
          class="mt-4 space-y-4 md:space-y-5 lg:mt-5"
          method="post"
          @submit.prevent="handleForm"
        >
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Nowe hasło</label
            >
            <input
              id="password"
              v-model="pass1"
              type="password"
              name="password"
              placeholder="••••••••"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              for="confirm-password"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Powtórz hasło</label
            >
            <input
              id="confirm-password"
              v-model="pass2"
              type="password"
              name="confirm-password"
              placeholder="••••••••"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>
          <button
            v-if="!isSubmitDisabled"
            type="submit"
            class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Zresetuj hasło
          </button>
          <button
            v-if="isSubmitDisabled"
            type="submit"
            disabled
            class="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Zresetuj hasło
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
