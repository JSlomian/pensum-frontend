<script setup lang="ts">
const routeString = useRoute()
const id = routeString.params.id
const route =  `/api/programs_in_majors?major.id=${id}`
useHead({
  title: 'Kierunki'
})


const {data, refresh, error, status} = await useFetch<{ member: ProgramInMajor[] }>(route)

</script>
<template>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Kierunek
          </th>
          <th scope="col" class="px-6 py-3">
            Poziom edukacji
          </th>
          <th scope="col" class="px-6 py-3">
            Tryb uczęszczania
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="pim in data?.member" :key="pim.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <span>
            {{ pim.major.name }}
            </span>
          </th>
          <td class="px-6 py-4">
            <span>
            {{ pim.educationLevel.name }}
            </span>
          </td>
          <td class="px-6 py-4">
            <span>
            {{ pim.attendanceMode.name }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div>
              <NuxtLink :to="`/przydzialy-godzin/program/${pim.id}`"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Wybierz</NuxtLink>
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