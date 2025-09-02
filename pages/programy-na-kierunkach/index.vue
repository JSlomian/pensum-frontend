<script setup lang="ts">
const route = '/api/programs_in_majors'
const majorsRoute = '/api/majors'
const educationLevelsRoute = '/api/education_levels'
const attendanceModesRoute = '/api/attendance_modes'
useHead({
  title: 'Programy',
})
definePageMeta({
  middleware: 'require-roles',
  requiresRoles: ['ROLE_ADMIN'],
})

const { data, refresh, error, status } = await useFetch<{ member: ProgramInMajor[] }>(route)
const { data: major } = await useFetch<{ member: Major[] }>(majorsRoute)
const { data: educationLevel } = await useFetch<{ member: EducationLevel[] }>(educationLevelsRoute)
const { data: attendanceMode } = await useFetch<{ member: AttendanceMode[] }>(attendanceModesRoute)

const { callUpdate } = useUpdate(route)
const { callDelete } = useDelete(route)
const editId = ref<number>(0)
const editMajorIri = ref<string>('')
const editEducationLevelIri = ref<string>('')
const editAttendanceModeIri = ref<string>('')
const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const startEdit = (pim: ProgramInMajor) => {
  editId.value = pim.id
  if (typeof pim.major === 'string') {
    editMajorIri.value = pim.major
  } else {
    editMajorIri.value = pim.major!['@id']
  }
  if (typeof pim.educationLevel === 'string') {
    editEducationLevelIri.value = pim.educationLevel
  } else {
    editEducationLevelIri.value = pim.educationLevel!['@id']
  }
  if (typeof pim.attendanceMode === 'string') {
    editAttendanceModeIri.value = pim.attendanceMode
  } else {
    editAttendanceModeIri.value = pim.attendanceMode!['@id']
  }
}

const cancelEdit = (): void => {
  editId.value = 0
  editMajorIri.value = ''
  editEducationLevelIri.value = ''
  editAttendanceModeIri.value = ''
}

const handleDelete = (id: number): void => {
  let pim: ProgramInMajor | undefined
  try {
    pim = data.value?.member.find((m: ProgramInMajor) => m.id === id)
    if (!pim) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    callDelete(pim.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${pim.id}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleUpdate = (pim: ProgramInMajor): void => {
  try {
    const updatedPim = {
      ...pim,
      major: editMajorIri.value || '',
      attendanceMode: editAttendanceModeIri.value || '',
      educationLevel: editEducationLevelIri.value || '',
    }

    callUpdate(updatedPim)
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

const openDeleteModal = (pim: ProgramInMajor): void => {
  modalOpen.value = true
  deleteId.value = pim.id
  modalText.value = `Czy napewno chcesz usunąć program <span style="font-weight: bold">${pim.major.name} ${pim.attendanceMode.abbreviation}</span>?`
}

const requiredFilled = computed(() => {
  return (
    major.value?.member?.length > 0 &&
    educationLevel.value?.member?.length > 0 &&
    attendanceMode.value?.member?.length > 0
  )
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
    <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
      <AlertWarning
        v-if="!requiredFilled"
        message="Musisz posiadać dostępne kierunki, tryby uczęszczania i poziomy edukacji aby dodać nowy"
      />
      <AddNewProgramInMajor v-if="requiredFilled" :route="route" @success="refresh" />
      <div v-if="requiredFilled" class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          v-if="data?.member && data?.member?.length > 0"
          class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Kierunek</th>
              <th scope="col" class="px-6 py-3">Poziom edukacji</th>
              <th scope="col" class="px-6 py-3">Tryb uczęszczania</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pim in data?.member as ProgramInMajor[]"
              :key="pim.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <select
                  v-if="editId === pim.id"
                  v-model="editMajorIri"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option
                    v-if="major?.member && major?.member?.length > 0"
                    v-for="maj in major?.member"
                    :value="maj['@id']"
                    :key="maj['@id']"
                  >
                    {{ maj.name }}
                  </option>
                </select>
                <span v-else>
                  {{ typeof pim.major === 'object' ? pim.major?.name : '' }}
                </span>
              </th>
              <td class="px-6 py-4">
                <select
                  v-if="editId === pim.id"
                  v-model="editAttendanceModeIri"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option
                    v-if="attendanceMode?.member && attendanceMode?.member?.length > 0"
                    v-for="am in attendanceMode?.member"
                    :value="am['@id']"
                    :key="am['@id']"
                  >
                    {{ am.name }}
                  </option>
                </select>
                <span v-else>
                  {{ typeof pim.attendanceMode === 'object' ? pim.attendanceMode?.name : '' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <select
                  v-if="editId === pim.id"
                  v-model="editEducationLevelIri"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option
                    v-if="educationLevel?.member && educationLevel?.member?.length > 0"
                    v-for="el in educationLevel?.member"
                    :value="el['@id']"
                    :key="el['@id']"
                  >
                    {{ el.name }}
                  </option>
                </select>
                <span v-else>
                  {{ typeof pim.educationLevel === 'object' ? pim.educationLevel?.name : '' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === pim.id">
                  <span
                    @click="handleUpdate(pim)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >Zapisz</span
                  >
                  <span
                    @click="handleCancelEdit"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >Anuluj</span
                  >
                </div>
                <div v-else>
                  <!--                      <NuxtLink :to="`/programy/${pim.id}`"-->
                  <!--                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Dodaj program</NuxtLink>-->
                  <span
                    @click="openDeleteModal(pim)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
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
