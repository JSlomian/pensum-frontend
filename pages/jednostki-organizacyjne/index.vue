<script setup lang="ts">
  const route = '/api/institutes'
  useHead({
    title: 'Jednostki Organizacyjne',
  })
  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: Institute[] }>(route)

  const editId = ref<number>(0)
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const handleDelete = async (id: number): Promise<void> => {
    const unit: Institute | undefined = data.value?.member.find((i: Institute) => i.id === id)
    if (!unit) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(unit.id, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Usunięto ${unit.name}`)
          handleCancelEdit()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się usunąć.`)
      },
    })
  }

  const handleUpdate = async (unit: Institute): Promise<void> => {
    await useUpdate(route).callUpdate(unit, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Zaktualizowano ${unit.name}`)
          handleCancelEdit()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się zaktualizować.`)
      },
    })
  }

  const handleCancelEdit = (): void => {
    editId.value = 0
    refresh()
    modalOpen.value = false
  }

  const openDeleteModal = (unit: Institute): void => {
    modalOpen.value = true
    deleteId.value = unit.id
    modalText.value = `Czy napewno chcesz usunąć jednostkę <span style="font-weight: bold">${unit.name}</span>?`
  }
</script>
<template>
  <div>
    <ModalDelete
      :open="modalOpen"
      :text="modalText"
      @confirm="handleDelete(deleteId)"
      @abort="modalOpen = false"
    />
    <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
      <AddNewInstitute :route="route" @success="refresh" />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          v-if="data?.member && data?.member?.length > 0"
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400 md:table-fixed rtl:text-right"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Pełna Nazwa</th>
              <th scope="col" class="px-6 py-3">Skrót</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="unit in data?.member as Institute[]"
              :key="unit.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <input
                  v-if="editId === unit.id"
                  v-model="unit.name"
                  type="text"
                  maxlength="255"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ unit.name }}
                </span>
              </th>
              <td class="px-6 py-4">
                <input
                  v-if="editId === unit.id"
                  v-model="unit.abbreviation"
                  type="text"
                  maxlength="10"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ unit.abbreviation }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === unit.id">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleUpdate(unit)"
                    >Zapisz</span
                  >
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleCancelEdit"
                    >Anuluj</span
                  >
                </div>
                <div v-else>
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="editId = unit.id"
                    >Edytuj</span
                  >
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="openDeleteModal(unit)"
                    >Usuń</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AlertWarning
        v-if="data?.member && data?.member?.length == 0"
        message="Brak dostępnych jednostek organizacyjnych, dodaj nową."
      />
    </div>
  </div>
</template>

<style scoped></style>
