<script setup lang="ts">
const route = '/api/institutes'
useHead({
  title: 'Jednostki Organizacyjne'
})
const {data, refresh} = await useFetch(route, {lazy: true})
const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const modalOpen = ref(false)


const cancelEdit = (): void => {
  editId.value = null
}

const handleDelete = (id: number) => {
  callDelete(id)
  modalOpen.value = false
  refresh()
}

const handleUpdate = (classType: { id: number, name: string, abbreviation: string }): void => {
  callUpdate(classType)
  handleCancelEdit()
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}

const modalTitle = ref('Usuwanie jednostki organizacyjnej')
const modalText = ref('')

const openDeleteModal = (unit: { id: number, name: string, abbreviation: string }): void => {
  modalOpen.value = true
  deleteId.value = unit.id
  modalText.value = `Czy napewno chcesz usunąć jednostkę <span style="font-weight: bold">${unit.name}</span>?`
}
</script>

<template>
  <ModalDelete v-if="modalOpen" :title="modalTitle" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6">
    <AddNewInstitute @success="refresh" :route="route"/>
    <div v-if="data?.member?.length > 0" class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Pełna nazwa
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Skrót
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
            Akcja
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <!-- Row 1 -->
        <tr v-for="unit in data.member" :key="unit.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <input type="text" v-model="unit.name" v-if="editId === unit.id" maxlength="255"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ unit.name }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <input type="text" v-model="unit.abbreviation" v-if="editId === unit.id" maxlength="10"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ unit.abbreviation }}
            </span></td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div v-if="editId === unit.id">
              <button class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                      @click="handleUpdate(unit)">Zapisz
              </button>
              <button class="px-4 py-2 ml-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      @click="handleCancelEdit">Anuluj
              </button>
            </div>
            <div v-else>
              <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      @click="editId = unit.id">Edytuj
              </button>
              <button class="px-4 py-2 ml-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      @click="openDeleteModal(unit)">Usuń
              </button>
            </div>

          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="block relative mb-4 mt-4 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700"
         role="alert">
      <span class="block sm:inline">Brak dostępnych jednostek organizacyjnych, dodaj nową.</span>
    </div>
  </div>
</template>

<style scoped>
</style>