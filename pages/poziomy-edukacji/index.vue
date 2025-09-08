<script setup lang="ts">
  const route = '/api/education_levels'
  useHead({
    title: 'Poziomy Edukacji',
  })
  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: EducationLevel[] }>(route)

  const editId = ref<number>(0)
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const handleDelete = async (id: number): Promise<void> => {
    const el: EducationLevel | undefined = data.value?.member.find(
      (el: EducationLevel) => el.id === id
    )
    if (!el) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(el.id, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Usunięto ${el.name}`)
          handleCancelEdit()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się usunąć.`)
      },
    })
  }

  const handleUpdate = async (el: EducationLevel): Promise<void> => {
    await useUpdate(route).callUpdate(el, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Zaktualizowano ${el.name}`)
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
    modalOpen.value = false
    refresh()
  }

  const openDeleteModal = (el: EducationLevel): void => {
    modalOpen.value = true
    deleteId.value = el.id
    modalText.value = `Czy napewno chcesz usunąć poziom edukacji <span style="font-weight: bold">${el.name}</span>?`
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
      <AddNewAttendanceMode :route="route" @success="refresh" />
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
              v-for="mode in data?.member as EducationLevel[]"
              :key="mode.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <input
                  v-if="editId === mode.id"
                  v-model="mode.name"
                  type="text"
                  maxlength="50"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ mode.name }}
                </span>
              </th>
              <td class="px-6 py-4">
                <input
                  v-if="editId === mode.id"
                  v-model="mode.abbreviation"
                  type="text"
                  maxlength="10"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ mode.abbreviation }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === mode.id">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleUpdate(mode)"
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
                    @click="editId = mode.id"
                    >Edytuj</span
                  >
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="openDeleteModal(mode)"
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
        message="Brak dostępnych poziomów edukacji, dodaj nowy."
      />
    </div>
  </div>
</template>

<style scoped></style>
