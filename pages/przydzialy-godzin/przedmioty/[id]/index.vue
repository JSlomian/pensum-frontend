<script setup lang="ts">
const routeString = useRoute()
const id = routeString.params.id
const route = `/api/subjects?program.id=${id}`
const ctRoute = `/api/class_types`
useHead({
  title: 'Przedmioty'
})

const {getSession} = useAuth()
const user = await getSession()
const isAdmin = user && user.roles.includes('ROLE_ADMIN')

const {data, refresh, error, status} = await useFetch<{ member: Subject[] }>(route)
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)


</script>
<template>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3 w-12">
            #
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            Przedmiot
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            Ilość grup
            <!--            <table>-->
            <!--              <thead>-->
            <!--              <tr>-->
            <!--                <td :colspan="classTypes?.member.length" class="text-center">-->
            <!--                  Ilość grup-->
            <!--                </td>-->
            <!--              </tr>-->
            <!--              <tr>-->
            <!--                <td v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id" :class="`p-1 text-center ${index !== 0 && index !== classTypes?.value?.length - 1 ? 'border-l' : ''}`">-->
            <!--                  {{ ct.abbreviation }}-->
            <!--                </td>-->
            <!--              </tr>-->
            <!--              </thead>-->
            <!--            </table>-->
          </th>
          <th scope="col" class="px-6 py-3">
            Razem godzin
          </th>
          <th scope="col" class="px-6 py-3">
            Łącznie godzin
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        <tr>
          <th scope="col" class="px-6 py-3">
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
          <th scope="col" class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.value?.length - 1 ? 'border-l' : ''}`">
              {{ ct.abbreviation }}
            </span>
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(subject, index) in data?.member as Subject[]" :key="subject.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ index }}
          </th>
          <td class="px-6 py-3">
            {{ subject.name }}
          </td>
          <td class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.value?.length - 1 ? 'border-l' : ''}`">
<!--            <template v-for="group in subject.subjectGroups as SubjectGroup[]">-->
              <!--              <template v-if="subject.subjectGroups.find(ct.id)">-->
                {{ subject.subjectGroups.find((sg) => sg.id === ct.id)?.amount || 0 }}
              <!--              </template>-->
              <!--            </template>-->
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div>
              <!--              <NuxtLink :to="`/przydzialy-godzin/przedmioty/${prog.id}`"-->
              <!--                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Wybierz-->
              <!--              </NuxtLink>-->
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych przedmiotów, dodaj nowy."/>
  </div>
</template>

<style scoped>
</style>