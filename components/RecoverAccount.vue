<script setup lang="ts">
  const sendEmailRoute = '/api/reset-password'
  const email = ref<string>('')
  const emits = defineEmits(['sent'])
  const buttonBlocked = ref<boolean>(false)
  const handleSubmit = async () => {
    buttonBlocked.value = true
    const res = await $fetch<{ status: 'sent' | 'error' }>(sendEmailRoute, {
      method: 'POST',
      body: { email: email.value },
    })

    if (res.status == 'sent') {
      emits('sent')
      await showToast('success', 'Wysłano zapytanie')
    }

    if (res.status == 'error') {
      await showToast('danger', 'Wystąpił błąd spróbuj ponownie')
    }
    buttonBlocked.value = false
  }
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
          Ustaw nowe hasło
        </h1>
        <p class="font-light text-gray-500 dark:text-gray-400">
          Wpisz email aby ustawić nowe hasło
        </p>
        <form
          class="mt-4 space-y-4 md:space-y-5 lg:mt-5"
          method="post"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Twój email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="inazwisko@upsl.edu.pl"
              required
              :disabled="buttonBlocked"
            />
          </div>
          <!-- <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
</div>
</div> -->
          <button
            type="submit"
            class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Resetuj hasło
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
