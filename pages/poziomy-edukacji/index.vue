<script setup lang="ts">
const route = '/api/education_levels'
useHead({
  title: 'Poziomy Edukacji'
})


const {data, refresh, error, status} = await useFetch<{ member: EducationLevel[] }>(route)

const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)
const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')




const cancelEdit = (): void => {
  editId.value = 0
}

const handleDelete = (id: number): void => {
  let el: EducationLevel | undefined
  try {
    el = data.value?.member.find((el: EducationLevel) => el.id === id);
    if (!el) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(el.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${el.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (el: EducationLevel): void => {
  try {
    callUpdate(el)
    handleCancelEdit()
    showToast('success', `Zaktualizowano ${el.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const openDeleteModal = (el: EducationLevel): void => {
  modalOpen.value = true
  deleteId.value = el.id
  modalText.value = `Czy napewno chcesz usunąć poziom edukacji <span style="font-weight: bold">${el.name}</span>?`
}
</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewAttendanceMode @success="refresh" :route="route"/>
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
            <span class="sr-only">Action</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="mode in data?.member" :key="mode.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input type="text" v-model="mode.name" v-if="editId === mode.id" maxlength="50"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ mode.name }}
            </span>
          </th>
          <td class="px-6 py-4">
            <input type="text" v-model="mode.abbreviation" maxlength="10" v-if="editId === mode.id"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ mode.abbreviation }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div v-if="editId === mode.id">
              <span @click="handleUpdate(mode)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
              <span @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
            </div>
            <div v-else>
              <span @click="editId = mode.id" class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
              <span @click="openDeleteModal(mode)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych poziomów edukacji, dodaj nowy."/>
  </div>
</template>

<style scoped>
</style>