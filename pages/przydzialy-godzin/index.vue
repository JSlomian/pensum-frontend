<script setup lang="ts">
const route = '/api/majors'
useHead({
  title: 'Kierunki'
})


const {data, refresh, error, status} = await useFetch<{ member: Major[] }>(route)

</script>
<template>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="mb-4 flex justify-end">
      <NuxtLink to="/kierunki"
                type="button"
                class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
        Edycja kierunków
      </NuxtLink>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Pełna Nazwa
          </th>
          <th scope="col" class="px-6 py-3">
            Skrót
          </th>
          <th scope="col" class="px-6 py-3">
            Jednostka
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="major in data?.member" :key="major.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
              <NuxtLink :to="`/przydzialy-godzin/${major.id}`"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Wybierz
              </NuxtLink>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych kierunków, dodaj nowy."/>
  </div>
</template>

<style scoped>
</style>