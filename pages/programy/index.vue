<script setup lang="ts">
  const route = '/api/programs'
  const pimsRoute = '/api/programs_in_majors'
  useHead({
    title: 'Programy',
  })
  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: Program[] }>(route)
  const { data: pims } = await useFetch<{ member: Major[] }>(pimsRoute)

  const { callUpdate } = useUpdate(route)
  const { callDelete } = useDelete(route)
  const editId = ref<number>(0)
  const editPimIri = ref<string>('')
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const startEdit = (prog: Program) => {
    editId.value = prog.id
  }

  const cancelEdit = (): void => {
    editId.value = 0
    editPimIri.value = ''
  }

  const handleDelete = async (id: number): Promise<void> => {
    let prog: Program | undefined
    try {
      prog = data.value?.member.find((m: Program) => m.id === id)
      if (!prog) {
        await showToast('danger', 'Przekazano id do nieistniejącej pozycji')
        modalOpen.value = false
        return
      }
      const res = await callDelete(prog.id)
      if (res.data?.value?.statusCode) {
        return
      }
      await refresh()
      showToast('success', `Usunięto`)
    } catch (e) {
      showToast('danger', `Nie udało się usunąć.`)
    } finally {
      modalOpen.value = false
    }
  }

  const handleUpdate = (prog: Program): void => {
    try {
      callUpdate(prog)
      handleCancelEdit()
      showToast('success', `Zaktualizowano`)
    } catch (e) {
      showToast('danger', `Nie udało się zaktualizować.`)
    }
  }

  const handleCancelEdit = (): void => {
    cancelEdit()
    refresh()
  }

  const openDeleteModal = (prog: Program): void => {
    modalOpen.value = true
    deleteId.value = prog.id
    modalText.value = `Czy napewno chcesz usunąć program <br />
    Semestr: <span style="font-weight: bold">${prog.semester}</span>,
    Rok: <span style="font-weight: bold">${prog.planYear}</span>,
    Rok sylabusowy: <span style="font-weight: bold">${prog.syllabusYear}</span>? <br />
    Zostaną usunięte wszystkie przydziały`
  }

  const requiredFilled = computed((): boolean => {
    return pims.value?.member?.length > 0
  })
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
    <AlertWarning
      v-if="!requiredFilled"
      message="Musisz posiadać dostępne programy na kierunkach"
    />
    <AddNewProgram v-if="requiredFilled" :route="route" @success="refresh" />
    <div v-if="requiredFilled" class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table
        v-if="data?.member && data?.member?.length > 0"
        class="w-full text-left text-sm text-gray-500 dark:text-gray-400 md:table-fixed rtl:text-right"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Kierunek</th>
            <th scope="col" class="px-6 py-3">Semestr</th>
            <th scope="col" class="px-6 py-3">Rok</th>
            <th scope="col" class="px-6 py-3">
              <span class="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="prog in data?.member as Program[]"
            :key="prog.id"
            class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              <span>
                {{ prog.programInMajors.major?.abbreviation }}-{{
                  prog.programInMajors.educationLevel.abbreviation
                }}-{{ prog.programInMajors.attendanceMode.abbreviation }}
              </span>
            </th>
            <td class="px-6 py-4">
              {{ prog.semester }}
            </td>
            <td class="px-6 py-4">
              {{ prog.planYear }}
            </td>
            <td class="px-6 py-4 text-right">
              <div v-if="editId === prog.id">
                <span
                  class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                  @click="handleUpdate(prog)"
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
                  @click="openDeleteModal(prog)"
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
      message="Brak dostępnych programów, dodaj nowy."
    />
  </div>
    </div>
</template>

<style scoped></style>
