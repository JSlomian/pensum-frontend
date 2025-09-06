<script setup lang="ts">
  const routeString = useRoute()
  const id = routeString.params.id as unknown as number
  const route = `/api/subjects?program.id=${id}`
  const progRoute = `/api/programs/${id}`
  const ctRoute = `/api/class_types`
  const usrRoute = `/api/users`
  const editId = ref<number>(0)
  const importBtnVisible = ref<boolean>(true)
  const addNewBtnVisible = ref<boolean>(true)

  const { getSession } = useAuth()
  const user = await getSession()
  const isAdmin = user && user.roles.includes('ROLE_ADMIN')

  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const { data, refresh } = await useFetch<{ member: Subject[] }>(route)
  const { data: program } = await useFetch<Program>(progRoute)
  const { data: classTypes } = await useFetch<{ member: ClassType[] }>(ctRoute)
  const { data: users } = await useFetch<{ member: ApiUser[] }>(usrRoute)

  useHead(
    computed(() => {
      if (program.value) {
        const abbMaj = program.value.programInMajors.major?.abbreviation ?? ''
        const abbEd = program.value.programInMajors.educationLevel.abbreviation
        const abbAt = program.value.programInMajors.attendanceMode.abbreviation

        return {
          title: `Przedmioty – ${abbMaj}-${abbEd}-${abbAt}`,
        }
      }
      return { title: 'Przedmioty' }
    })
  )

  const handleDelete = async (id: number): Promise<void> => {
    const subject: Subject | undefined = data.value?.member.find((subject: Subject) => subject.id === id)
    if (!subject) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(subject.id, {
      onResponse() {
        showToast('success', `Usunięto ${subject.name}`)
      },
      onResponseError() {
        showToast('danger', `Nie udało się usunąć.`)
      },
    })
    modalOpen.value = false
    refresh()
  }

  const handleCancelEdit = (): void => {
    cancelEdit()
    refresh()
  }
  const cancelEdit = (): void => {
    editId.value = 0
  }

  const startEdit = (subject: Subject) => {
    editId.value = subject.id
  }

  const openDeleteModal = (subject: Subject): void => {
    modalOpen.value = true
    deleteId.value = subject.id
    modalText.value = `Czy napewno chcesz usunąć przedmiot <span style = "font-weight: bold" > ${subject.name}</span>?`
  }
  const showButtons = (): void => {
    importBtnVisible.value = true
    addNewBtnVisible.value = true
  }
  const finishedAdding = (): void => {
    refresh()
    showButtons()
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
    <div class="container-fluid relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
      <div class="flex-column flex justify-end">
        <ImportSubjectsFromProgram
          v-if="isAdmin && importBtnVisible"
          :program-id="id"
          @success="finishedAdding"
          @hide-add-new="addNewBtnVisible = false"
          @abort="showButtons"
        />
        <AddNewSubject
          v-if="isAdmin && addNewBtnVisible"
          :program-id="id"
          @success="finishedAdding"
          @hide-import="importBtnVisible = false"
          @abort="showButtons"
        />
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          v-if="data?.member && data?.member?.length > 0"
          class="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
          >
            <template v-if="editId != 0">
              <tr>
                <th colspan="7" class="text-center align-middle">Edycja</th>
              </tr>
            </template>
            <template v-else>
              <tr>
                <th scope="col" rowspan="2" class="w-12 text-center align-middle">#</th>
                <th scope="col" rowspan="2" class="w-[250px] text-center">Przedmiot</th>
                <th scope="col" class="w-[200px] text-center">Ilość grup</th>
                <th scope="col" class="w-[200px] text-center">Razem godzin</th>
                <th scope="col" rowspan="2" class="w-[75px] text-center">Łącznie godzin</th>
                <th scope="col" rowspan="2" class="text-center">Wykładowcy</th>
                <th scope="col" class="w-[100px]">
                  <span class="sr-only">Action</span>
                </th>
              </tr>
              <tr>
                <th scope="col" class="text-center">
                  <span
                    v-for="(ct, index) in classTypes?.member as ClassType[]"
                    :key="ct.id"
                    :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
                  >
                    {{ ct.abbreviation }}
                  </span>
                </th>
                <th scope="col" class="text-center">
                  <span
                    v-for="(ct, index) in classTypes?.member as ClassType[]"
                    :key="ct.id"
                    :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
                  >
                    {{ ct.abbreviation }}
                  </span>
                </th>
                <th scope="col" class="w-auto"></th>
              </tr>
            </template>
          </thead>
          <tbody>
            <tr
              v-for="(subject, index) in data?.member as Subject[]"
              :key="subject.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <template v-if="editId === subject.id">
                <td colspan="7" class="px-6 py-4 hover:bg-white dark:hover:bg-gray-800">
                  <EditSubject
                    v-if="program"
                    :program="program"
                    :subject="subject"
                    @abort="handleCancelEdit"
                    @success="handleCancelEdit"
                  />
                </td>
              </template>
              <template v-else>
                <th
                  scope="row"
                  class="w-[24px] whitespace-nowrap text-center font-medium text-gray-900 dark:text-white"
                >
                  {{ index + 1 }}
                </th>
                <td class="">
                  {{ subject.name }}
                </td>
                <td class="text-center">
                  <span
                    v-for="(ct, index) in classTypes?.member as ClassType[]"
                    :key="ct.id"
                    :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
                  >
                    {{
                      subject.subjectGroups?.find((sg) => sg.classType == ct['@id'])?.amount ||
                      '&nbsp;'
                    }}
                  </span>
                </td>
                <td class="text-center">
                  <span
                    v-for="(ct, index) in classTypes?.member as ClassType[]"
                    :key="ct.id"
                    :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
                  >
                    {{
                      subject.subjectGroups?.find((sg) => sg.classType == ct['@id'])?.amount *
                        subject.subjectHours?.find((sh) => sh.classType == ct['@id'])
                          ?.hoursRequired || '&nbsp;'
                    }}
                  </span>
                </td>
                <td class="text-center">
                  {{
                    subject.subjectLecturers?.reduce((sum, h) => sum + h.subjectHours, 0) || 0
                  }}/{{ subject.subjectHours?.reduce((sum, h) => sum + h.hoursRequired, 0) || 0 }}
                </td>
                <td class="whitespace-nowrap text-right" :colspan="isAdmin ? 1 : 2">
                  <div class="block w-[100%] overflow-x-auto">
                    <!--              <ul v-for="(sj, index) in subject.subjectLecturers as SubjectLecturer[]" :key="sj.id">-->
                    <!--                <li>{{ sj.classType.abbreviation }} {{ sj.subjectHours }} {{ sj.user.first_name }} {{ sj.user.last_name }}</li>-->
                    <!--              </ul>-->
                    <span
                      v-for="(sj, index) in subject.subjectLecturers as SubjectLecturer[]"
                      :key="sj.id"
                      class="mr-2 inline-block"
                    >
                      <span v-if="classTypes?.member" class="inline-block w-[32px] border-r pe-1">
                        {{
                          classTypes.member?.find((ct) => ct['@id'] == sj.classType).abbreviation ||
                          ' '
                        }}
                      </span>
                      <span class="border-r pe-1 ps-1">
                        {{ sj.subjectHours }}
                      </span>
                      <span v-if="users?.member" class="col-span-4 pe-1 ps-1">
                        {{ users.member?.find((u) => u['@id'] == sj.user).first_name }}
                        {{ users.member?.find((u) => u['@id'] == sj.user).last_name }}
                      </span>
                    </span>
                  </div>
                </td>
                <td v-if="isAdmin" class="w-[100px] pe-1 text-right">
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="startEdit(subject)"
                    >Edytuj
                  </span>
                  <span
                    class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                    @click="openDeleteModal(subject)"
                    >Usuń</span
                  >
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <AlertWarning
        v-if="data?.member && data?.member?.length == 0"
        message="Brak dostępnych przedmiotów, dodaj nowy."
      />
    </div>
  </div>
</template>

<style scoped></style>
