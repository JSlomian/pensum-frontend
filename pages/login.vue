<script setup lang="ts">
  const { signIn } = useAuth()
  const router = useRouter()
  definePageMeta({
    layout: 'login',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/',
    },
  })
  const email = ref('')
  const password = ref('')

  const handleSubmit = async () => {
    try {
      await signIn(
        {
          email: email.value,
          password: password.value,
        },
        {
          redirect: false,
          fetchOptions: {
            credentials: 'include' 
          },
        }
      )
      await router.push('/')
    } catch (e) {
      let apiError = 'Nie udało się zalogować'
      apiError = apiError + ', nieprawidłowe hasło lub login.'
      await showToast('danger', apiError)
    }
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
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            Zaloguj się
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Twój Email</label
              >
              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="inazwisko@upsl.edu.pl"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Hasło</label
              >
              <input
                id="password"
                v-model="password"
                type="password"
                name="password"
                placeholder="••••••••"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Zaloguj
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Nie pamiętasz hasła?
              <NuxtLink
                to="/odzyskiwanie-konta"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Odzyskaj konto
              </NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
