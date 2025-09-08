<script setup lang="ts">
  const route = '/api/positions'
  useHead({
    title: 'Stanowiska',
  })
  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: Position[] }>(route)
  const editId = ref<number>(0)
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const handleDelete = async (id: number): Promise<void> => {
    const p: Position | undefined = data.value?.member.find((p: Position) => p.id === id)
    if (!p) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(p.id, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Usunięto ${p.title}`)
          handleCancelEdit()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się usunąć.`)
      },
    })
  }

  const handleUpdate = async (position: Position): Promise<void> => {
    await useUpdate(route).callUpdate(position, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          handleCancelEdit()
          showToast('success', `Zaktualizowano ${position.title}`)
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się zaktualizować.`)
      },
    })
  }

  const handleCancelEdit = (): void => {
    editId.value = 0
    modalOpen.value = false
    refresh()
  }

  const openDeleteModal = (position: Position): void => {
    modalOpen.value = true
    deleteId.value = position.id
    modalText.value = `Czy napewno chcesz usunąć stanowisko <span style="font-weight: bold">${position.title}</span>?`
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
      <AddNewPosition :route="route" @success="refresh" />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          v-if="data?.member && data?.member?.length > 0"
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400 md:table-fixed rtl:text-right"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Tytuł</th>
              <th scope="col" class="px-6 py-3">Skrót</th>
              <th scope="col" class="px-6 py-3">Opis</th>
              <th scope="col" class="w-24 px-6 py-3">Pensum</th>
              <th scope="col" class="w-36 px-6 py-3">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pos in data?.member"
              :key="pos.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <textarea
                  v-if="editId === pos.id"
                  v-model="pos.title"
                  maxlength="255"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                ></textarea>
                <span v-else class="break-words">
                  {{ pos.title }}
                </span>
              </th>
              <td class="px-6 py-4">
                <input
                  v-if="editId === pos.id"
                  v-model="pos.abbreviation"
                  type="text"
                  maxlength="30"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ pos.abbreviation }}
                </span>
              </td>
              <td class="px-6 py-4">
                <textarea
                  v-if="editId === pos.id"
                  v-model="pos.description"
                  maxlength="255"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                ></textarea>
                <span v-else class="break-words" :title="pos.description">
                  {{ pos.description.substring(0, 50)
                  }}<span v-if="pos.description.length > 50">...</span>
                </span>
              </td>
              <td class="px-6 py-4">
                <input
                  v-if="editId === pos.id"
                  v-model="pos.pensum"
                  type="number"
                  maxlength="10"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ pos.pensum }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === pos.id">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleUpdate(pos)"
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
                    @click="editId = pos.id"
                    >Edytuj</span
                  >
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="openDeleteModal(pos)"
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
        message="Brak dostępnych stanowisk, dodaj nowe."
      />
    </div>
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
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
