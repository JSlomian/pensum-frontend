<script setup lang="ts">
import AlertWarning from "~/components/Alert/AlertWarning.vue";

const route = '/api/positions'
useHead({
  title: 'Stanowiska'
})

type Position = {
  id: number,
  title: string,
  abbreviation: string,
  description: string,
  pensum: number
}

const {data, refresh} = await useFetch<{ member: Position[]}>(route)
const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)
const deleteId = ref<number>(0)
const modalOpen = ref(false)
const modalText = ref('')


const cancelEdit = (): void => {
  editId.value = 0
}

const handleDelete = (id: number): void => {
  let p: Position | undefined
  try {
    p = data.value?.member.find((p: Position) => p.id === id);
    if (!p) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(p.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${p.title}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (position: Position): void => {
  try {
    callUpdate(position)
    handleCancelEdit()
    showToast('success', `Zaktualizowano ${position.title}`)
  } catch (e) {
    showToast('danger', 'Nie udało się zaktualizować')
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}


const openDeleteModal = (position: Position): void => {
  modalOpen.value = true
  deleteId.value = position.id
  modalText.value = `Czy napewno chcesz stanowisko <span style="font-weight: bold">${position.title}</span>?`
}
</script>

<template>
  <ModalDelete v-if="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6">
    <AddNewInstitute @success="refresh" :route="route"/>
    <div v-if="data?.member && data?.member?.length > 0" class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Tytuł naukowy
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Skrót
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Stanowisko
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Pensum
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
            Akcja
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <!-- Row 1 -->
        <tr v-for="pos in data?.member" :key="pos.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <input type="text" v-model="pos.title" v-if="editId === pos.id" maxlength="255"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ pos.title }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <input type="text" v-model="pos.abbreviation" v-if="editId === pos.id" maxlength="10"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ pos.abbreviation }}
            </span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <input type="text" v-model="pos.description" v-if="editId === pos.id" maxlength="10"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ pos.description }}
            </span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <input type="number" v-model="pos.pensum" v-if="editId === pos.id" maxlength="10"
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span v-else>
            {{ pos.pensum }}
            </span></td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

            <div v-if="editId === pos.id">
              <button class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                      @click="handleUpdate(pos)">Zapisz
              </button>
              <button class="px-4 py-2 ml-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      @click="handleCancelEdit">Anuluj
              </button>
            </div>
            <div v-else>
              <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      @click="editId = pos.id">Edytuj
              </button>
              <button class="px-4 py-2 ml-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      @click="openDeleteModal(pos)">Usuń
              </button>
            </div>

          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0" message="Brak dostępnych stanowisk, dodaj nowe." />
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>