<script setup lang="ts">
const route = '/api/class_types'
useHead({
  title: 'Formy zajęć'

})
definePageMeta({
  middleware: 'require-roles',
  requiresRoles: ['ROLE_ADMIN']
})

const {data, refresh} = await useFetch<{ member: ClassType[] }>(route)
const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)
const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const cancelEdit = (): void => {
  editId.value = 0
}

const handleDelete = async (id: number): Promise<void> => {
  let ct: ClassType | undefined; // Declare ct in an outer scope
  try {
    ct = data.value?.member.find((c: ClassType) => c.id === id);
    if (!ct) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    await callDelete(ct.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${ct.type}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = async (classType: ClassType): Promise<void> => {
  try {
    await callUpdate(classType)
    handleCancelEdit()
    showToast('success', `Zaktualizowano ${classType.type}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const openDeleteModal = (classType: ClassType): void => {
  modalOpen.value = true
  deleteId.value = classType.id
  modalText.value = `Czy napewno chcesz usunąć formę zajęć <span style="font-weight: bold">${classType.type}</span>?`
}


</script>

<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6">
    <AddNewClassType @success="refresh" :route="route"/>
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
        <tr v-for="classType in data.member as ClassType[]" :key="classType.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input type="text" v-model="classType.type" v-if="editId === classType.id" maxlength="255"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ classType.type }}
            </span>
          </th>
          <td class="px-6 py-4">
            <input type="text" v-model="classType.abbreviation" maxlength="10" v-if="editId === classType.id"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ classType.abbreviation }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div v-if="editId === classType.id">
              <span @click="handleUpdate(classType)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
              <span @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
            </div>
            <div v-else>
              <span @click="editId = classType.id"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
              <span @click="openDeleteModal(classType)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0" message="Brak dostępnych form zajęć, dodaj nowe."/>
  </div>

</template>

<style scoped>
</style>