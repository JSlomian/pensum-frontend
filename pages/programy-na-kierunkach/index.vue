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

  const { data, refresh } = await useFetch<{ member: ProgramInMajor[] }>(route)
  const { data: major } = await useFetch<{ member: Major[] }>(majorsRoute)
  const { data: educationLevel } = await useFetch<{ member: EducationLevel[] }>(
    educationLevelsRoute
  )
  const { data: attendanceMode } = await useFetch<{ member: AttendanceMode[] }>(
    attendanceModesRoute
  )

  const editId = ref<number>(0)
  const editMajorIri = ref<string>('')
  const editEducationLevelIri = ref<string>('')
  const editAttendanceModeIri = ref<string>('')
  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const handleDelete = async (id: number): Promise<void> => {
    const pim: ProgramInMajor | undefined = data.value?.member.find(
      (m: ProgramInMajor) => m.id === id
    )
    if (!pim) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(pim.id, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Usunięto ${pim.id}`)
          handleCancelEdit()
        }
      },
      onResponseError({ response }: { response: Response }) {
        if (response.status === 409) {
          showToast(
            'danger',
            `Nie można usunąć ${pim.major.name}-${pim.educationLevel.abbreviation}-${pim.attendanceMode.abbreviation} ponieważ istnieją powiązane programy`
          )
        }
        showToast('danger', `Nie udało się usunąć.`)
        handleCancelEdit()
      },
    })
  }

  const handleCancelEdit = (): void => {
    editId.value = 0
    editMajorIri.value = ''
    editEducationLevelIri.value = ''
    editAttendanceModeIri.value = ''
    modalOpen.value = false
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
    <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
      <AlertWarning
        v-if="!requiredFilled"
        message="Musisz posiadać dostępne kierunki, tryby uczęszczania i poziomy edukacji aby dodać nowy"
      />
      <AddNewProgramInMajor v-if="requiredFilled" :route="route" @success="refresh" />
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
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <select
                  v-if="editId === pim.id"
                  v-model="editMajorIri"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <template v-if="major?.member && major?.member?.length > 0">
                    <option v-for="maj in major?.member" :key="maj['@id']" :value="maj['@id']">
                      {{ maj.name }}
                    </option>
                  </template>
                </select>
                <span v-else>
                  {{ typeof pim.major === 'object' ? pim.major?.name : '' }}
                </span>
              </th>
              <td class="px-6 py-4">
                <select
                  v-if="editId === pim.id"
                  v-model="editAttendanceModeIri"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <template v-if="attendanceMode?.member && attendanceMode?.member?.length > 0">
                    <option
                      v-for="am in attendanceMode?.member"
                      :key="am['@id']"
                      :value="am['@id']"
                    >
                      {{ am.name }}
                    </option>
                  </template>
                </select>
                <span v-else>
                  {{ typeof pim.attendanceMode === 'object' ? pim.attendanceMode?.name : '' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <select
                  v-if="editId === pim.id"
                  v-model="editEducationLevelIri"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <template v-if="educationLevel?.member && educationLevel?.member?.length > 0">
                    <option
                      v-for="el in educationLevel?.member"
                      :key="el['@id']"
                      :value="el['@id']"
                    >
                      {{ el.name }}
                    </option>
                  </template>
                </select>
                <span v-else>
                  {{ typeof pim.educationLevel === 'object' ? pim.educationLevel?.name : '' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="editId === pim.id">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="handleUpdate(pim)"
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
                    @click="openDeleteModal(pim)"
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
