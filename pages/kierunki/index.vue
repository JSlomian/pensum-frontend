<script setup lang="ts">
const route =  '/api/majors'
const unitsRoute = '/api/institutes'
useHead({
  title: 'Kierunki'
})
definePageMeta({
  middleware: 'require-roles',
  requiresRoles: ['ROLE_ADMIN']
})

const {data, refresh, error, status} = await useFetch<{ member: Major[] }>(route)
const {data: institutes} = await useFetch<{ member: Institute[] }>(unitsRoute)

const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)
const editUnitIri = ref<string>('')
const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const startEdit = (major: Major) => {
  editId.value = major.id;
  if (typeof major.institute === 'string') {
  editUnitIri.value = major.institute
  } else {
  editUnitIri.value = major.institute!['@id']
  }
}

const cancelEdit = (): void => {
  editId.value = 0
  editUnitIri.value = ''
}

const handleDelete = (id: number): void => {
  let major: Major | undefined
  try {
    major = data.value?.member.find((m: Major) => m.id === id);
    if (!major) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(major.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${major.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (major: Major): void => {
  try {
    const updatedMajor = {
      ...major,
      institute: editUnitIri.value || '',
    }

    callUpdate(updatedMajor)
    handleCancelEdit()
    showToast('success', `Zaktualizowano ${major.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const openDeleteModal = (major: Major): void => {
  modalOpen.value = true
  deleteId.value = major.id
  modalText.value = `Czy napewno chcesz usunąć kierunek <span style="font-weight: bold">${major.name}</span>?`
}

</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewMajor @success="refresh" :route="route"/>
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
        <tr v-for="major in data?.member as Major[]" :key="major.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input type="text" v-model="major.name" v-if="editId === major.id" maxlength="255"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ major.name }}
            </span>
          </th>
          <td class="px-6 py-4">
            <input type="text" v-model="major.abbreviation" maxlength="10" v-if="editId === major.id"
                   class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-else>
            {{ major.abbreviation }}
            </span>
          </td>
          <td class="px-6 py-4">
            <select
                v-if="editId === major.id"
                v-model="editUnitIri"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option
                  v-if="institutes?.member && institutes?.member?.length > 0"
                  v-for="institute in institutes?.member"
                  :value="institute['@id']"
                  :key="institute['@id']"
              >
                {{ institute.abbreviation }}
              </option>
            </select>
            <span v-else>
            {{ typeof major.institute === 'object' ? major.institute?.abbreviation : '' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div v-if="editId === major.id">
              <span @click="handleUpdate(major)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
              <span @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
            </div>
            <div v-else>
              <span @click="startEdit(major)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
              <span @click="openDeleteModal(major)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
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