<script setup lang="ts">
const route = '/api/programs'
const pimsRoute = '/api/programs_in_majors'
// const educationLevelsRoute = '/api/education_levels'
// const attendanceModesRoute = '/api/attendance_modes'
useHead({
  title: 'Programy'
})


const {data, refresh, error, status} = await useFetch<{ member: Program[] }>(route)
const {data: pims} = await useFetch<{ member: Major[] }>(pimsRoute)
// const {data: educationLevel} = await useFetch<{ member: EducationLevel[] }>(educationLevelsRoute)
// const {data: attendanceMode} = await useFetch<{ member: AttendanceMode[] }>(attendanceModesRoute)

const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)
const editId = ref<number>(0)
const editPimIri = ref<string>('')
// const editEducationLevelIri = ref<string>('')
// const editAttendanceModeIri = ref<string>('')
const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const startEdit = (prog: Program) => {
  editId.value = prog.id;
  // if (typeof pim.major === 'string') {
  //   editMajorIri.value = pim.major
  // } else {
  //   editMajorIri.value = pim.major!['@id']
  // }
  // if (typeof pim.educationLevel === 'string') {
  //   editEducationLevelIri.value = pim.educationLevel
  // } else {
  //   editEducationLevelIri.value = pim.educationLevel!['@id']
  // }
  // if (typeof pim.attendanceMode === 'string') {
  //   editAttendanceModeIri.value = pim.attendanceMode
  // } else {
  //   editAttendanceModeIri.value = pim.attendanceMode!['@id']
  // }
}

const cancelEdit = (): void => {
  editId.value = 0
  editPimIri.value = ''
  // editEducationLevelIri.value = ''
  // editAttendanceModeIri.value = ''
}

const handleDelete = async (id: number): Promise<void> => {
  let prog: Program | undefined
  try {
    prog = data.value?.member.find((m: Program) => m.id === id);
    if (!prog) {
      await showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    const res = await callDelete(prog.id)
    console.log(res)
    modalOpen.value = false
    await refresh()
    await showToast('success', `Usunięto ${prog.id}`)
  } catch (e) {
    await showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (prog: Program): void => {
  try {
    // const updatedPim = {
    //   ...pim,
    //   major: editMajorIri.value || '',
    //   attendanceMode: editAttendanceModeIri || '',
    //   educationLevel: editEducationLevelIri || ''
    // }

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
  modalText.value = `Czy napewno chcesz usunąć program <span style="font-weight: bold">${prog.id}</span>?`
}

const requiredFilled = computed((): boolean => {
  return pims.value?.member?.length > 0
})

</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AlertWarning v-if="!requiredFilled"
                  message="Musisz posiadać dostępne progrmay na kierunkach"/>
    <AddNewProgram v-if="requiredFilled" @success="refresh" :route="route"/>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="requiredFilled">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Kierunek
          </th>
          <th scope="col" class="px-6 py-3">
            Semestr
          </th>
          <th scope="col" class="px-6 py-3">
            Rok
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="prog in data?.member as Program[]" :key="prog.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                      <span @click="handleUpdate(prog)"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
              <span @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
            </div>
            <div v-else>
              <span @click="openDeleteModal(prog)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych programów, dodaj nowy."/>
  </div>
</template>

<style scoped>
</style>