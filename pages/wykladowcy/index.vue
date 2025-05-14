<script setup lang="ts">
const route = '/api/users'
useHead({
  title: 'Wykładowcy'
})
definePageMeta({
  middleware: 'require-roles',
  requiresRoles: ['ROLE_ADMIN']
})

const {data, refresh, error, status} = await useFetch<{ member: ApiUser[] }>(route)


console.log(data)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)

const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const startEdit = (user: ApiUser) => {
  editId.value = user.id;
}

const cancelEdit = (): void => {
  editId.value = 0
}

const handleDelete = (id: number): void => {
  let user: ApiUser | undefined
  try {
    user = data.value?.member.find((u: ApiUser) => u.id === id);
    if (!user) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(user.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${user.first_name} ${user.last_name}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const openDeleteModal = (user: ApiUser): void => {
  modalOpen.value = true
  deleteId.value = user.id
  modalText.value = `Czy napewno chcesz usunąć kierunek <span style="font-weight: bold">${user.first_name} ${user.last_name}</span>?`
}

</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewUser @success="refresh" :route="route"/>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr v-if="editId == 0">
          <th scope="col" class="px-6 py-3 w-12">
            #
          </th>
          <th scope="col" class="px-6 py-3">
            Tytuł, Imię i nazwisko
          </th>
          <th scope="col" class="px-6 py-3 w-24">
            Pensum
          </th>
          <th scope="col" class="px-6 py-3 w-36">
            Jednostka
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        <tr v-else>
          <th scope="col" colspan="5" class="px-6 py-3 text-center">
            Edycja użytkownika
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in data?.member as ApiUser[]" :key="user.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <template v-if="editId == user.id">
            <td class="px-6 py-4" colspan="5">
<!--              <EditUser :user="user" @abort="handleCancelEdit" @success="handleCancelEdit"/>-->
            </td>
          </template>
          <template v-else>
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ index+1 }}
          </th>
          <td class="px-6 py-4">
            {{ user.position?.abbreviation || '' }} {{ user.first_name }} {{ user.last_name }}
          </td>
          <td class="px-6 py-4 w-36">
              {{ user.position?.pensum || "" }}
          </td>
          <td class="px-6 py-4 w-24">
<!--            <select-->
<!--                v-if="editId === user.id"-->
<!--                v-model="editUnitIri"-->
<!--                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
<!--              <option-->
<!--                  v-if="institutes?.member && institutes?.member?.length > 0"-->
<!--                  v-for="institute in institutes?.member"-->
<!--                  :value="institute['@id']"-->
<!--                  :key="institute['@id']"-->
<!--              >-->
<!--                {{ institute.abbreviation }}-->
<!--              </option>-->
<!--            </select>-->
            {{ user.institute?.abbreviation || "Brak" }}
          </td>
<!--          <td class="px-6 py-4 w-24">-->
<!--            <span v-if="editId === user.id">-->
<!--            <label class="inline-flex items-center mb-5 cursor-pointer">-->
<!--              <input type="checkbox" v-model="user.roles"-->
<!--                     value="ROLE_ADMIN" class="sr-only peer" :checked="user.roles.includes('ROLE_ADMIN')">-->
<!--              <div-->
<!--                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>-->
<!--              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Admin</span>-->
<!--            </label>-->
<!--            </span>-->
<!--            <span v-else>-->
<!--            {{ user.roles.includes('ROLE_ADMIN') ? "Admin" : "Użytkownik" }}-->
<!--            </span>-->
<!--          </td>-->
          <td class="px-6 py-4 text-right">
<!--            <div v-if="editId === user.id">-->
<!--              <span @click="handleUpdate(user)"-->
<!--                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>-->
<!--              <span @click="handleCancelEdit"-->
<!--                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>-->
<!--            </div>-->
            <div>
              <NuxtLink :to="`/raport/${user.id}`"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Raport
              </NuxtLink>
              <span @click="startEdit(user)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
              <span @click="openDeleteModal(user)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </div>
          </td>
          </template>
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