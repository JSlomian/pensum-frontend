<script setup lang="ts">
const routeString = useRoute()
const id = routeString.params.id as unknown as number
const route = `/api/subjects?program.id=${id}`
const progRoute = `/api/programs/${id}`
const ctRoute = `/api/class_types`
const usrRoute = `/api/users`
const editId = ref<number>(0)


const {getSession} = useAuth()
const user = await getSession()
const isAdmin = user && user.roles.includes('ROLE_ADMIN')
const {callDelete} = useDelete(route)

const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const {data, refresh, error, status} = await useFetch<{ member: Subject[] }>(route)
const {data: program, status: programStatus} = await useFetch<Program>(progRoute)
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)
const {data: users} = await useFetch<{ member: ApiUser[] }>(usrRoute)


useHead(
    computed(() => {
      if (program.value) {
        const abbMaj = program.value.programInMajors.major?.abbreviation ?? ''
        const abbEd = program.value.programInMajors.educationLevel.abbreviation
        const abbAt = program.value.programInMajors.attendanceMode.abbreviation

        return {
          title: `Przedmioty – ${abbMaj}-${abbEd}-${abbAt}`
        }
      }
      return {title: 'Przedmioty'}
    })
)

const handleDelete = (id: number): void => {
  let subject: Subject | undefined
  try {
    subject = data.value?.member.find((subject: Subject) => subject.id === id);
    if (!subject) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji');
      modalOpen.value = false
      return
    }
    callDelete(subject.id)
    modalOpen.value = false
    refresh()
    showToast('success', `Usunięto ${subject.id}`)
  } catch (e) {
    showToast('danger', `Nie udało się usunąć.`)
  }
}

const handleCancelEdit = (): void => {
  cancelEdit()
  refresh()
}
const cancelEdit = (): void => {
  editId.value = 0
}

const startEdit = (subject: Subject) => {
  editId.value = subject.id;
}

const openDeleteModal = (subject: Subject): void => {
  modalOpen.value = true
  deleteId.value = subject.id
  modalText.value = `Czy napewno chcesz usunąć przedmiot <span style = "font-weight: bold" > ${subject.name}</span>?`
}

</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container-fluid mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewSubject v-if="isAdmin" @success="refresh" :programId="id"/>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <template v-if="editId != 0">
          <tr>
            <th colspan="7" class="text-center align-middle">Edycja</th>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th scope="col" rowspan="2" class="text-center align-middle w-12">
              #
            </th>
            <th scope="col" rowspan="2" class="text-center w-[250px]">
              Przedmiot
            </th>
            <th scope="col" class="text-center w-[200px]">
              Ilość grup
            </th>
            <th scope="col" class="text-center w-[200px]">
              Razem godzin
            </th>
            <th scope="col" rowspan="2" class="text-center w-[75px]">
              Łącznie godzin
            </th>
            <th scope="col" rowspan="2" class="text-center">
              Wykładowcy
            </th>
            <th scope="col" class="w-[100px]">
              <span class="sr-only">Action</span>
            </th>
          </tr>
          <tr>
            <th scope="col" class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ ct.abbreviation }}
            </span>
            </th>
            <th scope="col" class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ ct.abbreviation }}
            </span>
            </th>
            <th scope="col" class="w-auto">
            </th>
          </tr>
        </template>
        </thead>
        <tbody>
        <tr v-for="(subject, index) in data?.member as Subject[]" :key="subject.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <template v-if="editId === subject.id">
            <td colspan="7" class="px-6 py-4 dark:hover:bg-gray-800 hover:bg-white">
              <EditSubject v-if="program" :program="program" :subject="subject" @abort="handleCancelEdit"
                           @success="handleCancelEdit"/>
            </td>
          </template>
          <template v-else>
            <th scope="row" class="text-center font-medium text-gray-900 whitespace-nowrap dark:text-white w-[24px]">
              {{ index + 1 }}
            </th>
            <td class="">
              {{ subject.name }}
            </td>
            <td class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
                {{ subject.subjectGroups?.find((sg) => sg.classType == ct['@id'])?.amount || "&nbsp;" }}
            </span>
            </td>
            <td class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
                {{
                (subject.subjectGroups?.find(
                        (sg) => sg.classType == ct['@id']
                    )?.amount
                    * subject.subjectHours?.find(
                        (sh) => sh.classType == ct['@id'])?.hoursRequired
                ) || "&nbsp;"
              }}
            </span>
            </td>
            <td class="text-center">
              {{
                subject.subjectLecturers?.reduce((sum, h) => sum + h.subjectHours, 0) || 0
              }}/{{ subject.subjectHours?.reduce((sum, h) => sum + h.hoursRequired, 0) || 0 }}
            </td>
            <td class="text-right whitespace-nowrap" :colspan="isAdmin ? 1:2">
              <div class="w-[100%] block overflow-x-auto">

                <!--              <ul v-for="(sj, index) in subject.subjectLecturers as SubjectLecturer[]" :key="sj.id">-->
                <!--                <li>{{ sj.classType.abbreviation }} {{ sj.subjectHours }} {{ sj.user.first_name }} {{ sj.user.last_name }}</li>-->
                <!--              </ul>-->
                <span v-for="(sj, index) in subject.subjectLecturers as SubjectLecturer[]" :key="sj.id"
                      class="inline-block mr-2">
              <span class="border-r inline-block w-[32px] pe-1" v-if="classTypes?.member">
                {{ classTypes.member?.find((ct) => ct['@id'] == sj.classType).abbreviation || " " }}
              </span>
              <span class="border-r ps-1 pe-1">
                {{ sj.subjectHours }}
              </span>
              <span class="ps-1 pe-1 col-span-4" v-if="users?.member">
                  {{
                  users.member?.find((u) => u['@id'] == sj.user).first_name
                }} {{ users.member?.find((u) => u['@id'] == sj.user).last_name }}
              </span>
            </span>
              </div>
            </td>
            <td v-if="isAdmin" class="text-right pe-1 w-[100px]">
              <span @click="startEdit(subject)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj
              </span>
              <span @click="openDeleteModal(subject)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Usuń</span>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak dostępnych przedmiotów, dodaj nowy."/>
  </div>
</template>

<style scoped>
</style>