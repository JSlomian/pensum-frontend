<script setup lang="ts">
  const route = '/api/majors'
  const unitsRoute = '/api/institutes'
  useHead({
    title: 'Kierunki',
  })
  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: Major[] }>(route)
  const { data: institutes } = await useFetch<{ member: Institute[] }>(unitsRoute)

  const { callUpdate } = useUpdate(route)
  const { callDelete } = useDelete(route)
  const editId = ref<number>(0)
  const editUnitIri = ref<string>('')
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const startEdit = (major: Major) => {
    editId.value = major.id
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

  const handleDelete = async (id: number): Promise<void> => {
    let major: Major | undefined
    try {
      major = data.value?.member.find((m: Major) => m.id === id)
      if (!major) {
        await showToast('danger', 'Przekazano id do nieistniejącej pozycji')
        modalOpen.value = false
        return
      }
      const res = await callDelete(major.id)
      if (res.data?.value?.statusCode === 409) {
        await showToast(
          'danger',
          `Nie można usunąć ${major.name} ponieważ istnieją powiązane programy na kierunkach`
        )
        return
      }
      refresh()
      await showToast('success', `Usunięto ${major.name}`)
    } catch (e) {
      await showToast('danger', `Nie udało się usunąć.`)
    } finally {
      modalOpen.value = false
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
  <div>
    <ModalDelete
      :open="modalOpen"
      :text="modalText"
      @confirm="handleDelete(deleteId)"
      @abort="modalOpen = false"
    />
    <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
      <AddNewMajor :route="route" @success="refresh" />
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
              <th scope="col" class="px-6 py-3">Jednostka</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="major in data?.member as Major[]"
              :key="major.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <input
                  v-if="editId === major.id"
                  v-model="major.name"
                  type="text"
                  maxlength="255"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ major.name }}
                </span>
              </th>
              <td class="px-6 py-4">
                <input
                  v-if="editId === major.id"
                  v-model="major.abbreviation"
                  type="text"
                  maxlength="10"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <span v-else>
                  {{ major.abbreviation }}
                </span>
              </td>
              <td class="px-6 py-4">
                <select
                  v-if="editId === major.id"
                  v-model="editUnitIri"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <template v-if="institutes?.member && institutes?.member?.length > 0">
                    <option
                      v-for="institute in institutes?.member"
                      :key="institute['@id']"
                      :value="institute['@id']"
                    >
                      {{ institute.abbreviation }}
                    </option>
                  </template>
                </select>
                <span v-else>
                  {{ typeof major.institute === 'object' ? major.institute?.abbreviation : '' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === major.id">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleUpdate(major)"
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
                    @click="startEdit(major)"
                    >Edytuj</span
                  >
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="openDeleteModal(major)"
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
        message="Brak dostępnych kierunków, dodaj nowy."
      />
    </div>
  </div>
</template>

<style scoped></style>
