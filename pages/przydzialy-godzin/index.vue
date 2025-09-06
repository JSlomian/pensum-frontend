<script setup lang="ts">
  const route = '/api/majors'
  useHead({
    title: 'Kierunki',
  })
  const { getSession } = useAuth()
  const user = await getSession()
  const isAdmin = user && user.roles.includes('ROLE_ADMIN')

  const { data } = await useFetch<{ member: Major[] }>(route)
</script>
<template>
  <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
    <div v-if="isAdmin" class="mb-4 flex justify-end">
      <NuxtLink
        to="/kierunki"
        type="button"
        class="mb-2 me-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
      >
        Edycja kierunków
      </NuxtLink>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table
        v-if="data?.member && data?.member?.length > 0"
        class="w-full text-left text-sm text-gray-500 dark:text-gray-400 md:table-fixed rtl:text-right"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Pełna Nazwa</th>
            <th scope="col" class="px-6 py-3">Skrót</th>
            <th scope="col" class="px-6 py-3">Jednostka</th>
            <th scope="col" class="px-6 py-3">
              <span class="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="major in data?.member"
            :key="major.id"
            class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              <span>
                {{ major.name }}
              </span>
            </th>
            <td class="px-6 py-4">
              <span>
                {{ major.abbreviation }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span>
                {{ typeof major.institute === 'object' ? major.institute?.abbreviation : '' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div>
                <NuxtLink
                  :to="`/przydzialy-godzin/${major.id}`"
                  class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >Wybierz
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning
      v-if="data?.member && data?.member?.length == 0"
      message="Brak dostępnych kierunków, dodaj nowy."
    />
  </div>
</template>

<style scoped></style>
