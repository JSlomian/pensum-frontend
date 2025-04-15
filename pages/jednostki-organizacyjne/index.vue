<script setup lang="ts">
const route = '/api/institutes'
useHead({
  title: 'Jednostki Organizacyjne'
})


const {data, refresh, error, status} = await useFetch<{ member: Institute[] }>(route)

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
  let unit: Institute | undefined
  try {
    unit = data.value?.member.find((i: Institute) => i.id === id);
    if (!unit) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(unit.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${unit.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (unit: Institute): void => {
  try {
    callUpdate(unit)
    handleCancelEdit()
    showToast('success', `Zaktualizowano ${unit.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const openDeleteModal = (unit: Institute): void => {
  modalOpen.value = true
  deleteId.value = unit.id
  modalText.value = `Czy napewno chcesz usunąć jednostkę <span style="font-weight: bold">${unit.name}</span>?`
}
</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewInstitute @success="refresh" :route="route"/>
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
        <tr v-for="unit in data?.member" :key="unit.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input type="text" v-model="unit.name" v-if="editId === unit.id" maxlength="255"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ unit.name }}
            </span>
          </th>
          <td class="px-6 py-4">
            <input type="text" v-model="unit.abbreviation" maxlength="10" v-if="editId === unit.id"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ unit.abbreviation }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div v-if="editId === unit.id">
              <span @click="handleUpdate(unit)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
              <span @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
            </div>
            <div v-else>
              <span @click="editId = unit.id" class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
              <span @click="openDeleteModal(unit)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych jednostek organizacyjnych, dodaj nową."/>
  </div>
</template>

<style scoped>
</style>