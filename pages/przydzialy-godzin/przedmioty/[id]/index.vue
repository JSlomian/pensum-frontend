<script setup lang="ts">
const routeString = useRoute()
const id = ref<number>(routeString.params.id as unknown as number)
const route = `/api/subjects?program.id=${id}`
const ctRoute = `/api/class_types`
const editId = ref<number>(0)
useHead({
  title: 'Przedmioty'
})

const {getSession} = useAuth()
const user = await getSession()
const isAdmin = user && user.roles.includes('ROLE_ADMIN')
const {callUpdate} = useUpdate(route)
const {callDelete} = useDelete(route)

const deleteId = ref<number>(0)
const modalOpen = ref<boolean>(false)
const modalText = ref<string>('')

const {data, refresh, error, status} = await useFetch<{ member: Subject[] }>(route)
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)

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
  modalText.value = `Czy napewno chcesz usunąć przedmiot <span style="font-weight: bold">${subject.name}</span>?`
}


</script>
<template>
  <ModalDelete :open="modalOpen" :text="modalText" @confirm="handleDelete(deleteId)"
               @abort="modalOpen = false"/>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
    <AddNewSubject @success="refresh" :programId="id"/>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table v-if="data?.member && data?.member?.length > 0"
             class="md:table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <template v-if="editId != 0">
          <tr><th colspan="7" class="text-center align-middle">Edycja</th></tr>
        </template>
        <template v-else>
        <tr>
          <th scope="col" class="text-center align-middle w-12">
            #
          </th>
          <th scope="col" class="text-center">
            Przedmiot
          </th>
          <th scope="col" class="text-center">
            Ilość grup
          </th>
          <th scope="col" class="text-center">
            Razem godzin
          </th>
          <th scope="col" class="text-center">
            Łącznie godzin
          </th>
          <th scope="col" class="text-center">
            Wykładowcy
          </th>
          <th scope="col" class="">
            <span class="sr-only">Action</span>
          </th>
        </tr>
        <tr>
          <th scope="col" class="">
          </th>
          <th scope="col" class="">
          </th>
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
          <th scope="col" class="">
          </th>
          <th scope="col" class="">
          </th>
          <th scope="col" class="">
          </th>
        </tr>
        </template>
        </thead>
        <tbody>
        <tr v-for="(subject, index) in data?.member as Subject[]" :key="subject.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <template v-if="editId === subject.id">
            <td colspan="7" class="px-6 py-4 dark:hover:bg-gray-800 hover:bg-white">
              <EditSubject :subject="subject" @abort="handleCancelEdit" @success="handleCancelEdit"/>
            </td>
          </template>
          <template v-else>
            <th scope="row" class="text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                {{ (subject.subjectGroups?.find((sg) => sg.classType == ct['@id'])?.amount*subject.subjectHours.find((sh) => sh.classType == ct['@id'])?.hoursRequired) || "&nbsp;" }}
            </span>
            </td>
            <td class="text-center">
              ({{ subject.subjectLecturers?.reduce((sum, h) => sum + h.subjectHours, 0) || 0 }}){{ subject.subjectHours?.reduce((sum, h) => sum + h.hoursRequired, 0) || "" }}
            </td>
            <td class="text-center">

            </td>
            <td class="text-right pe-1">
              <span @click="startEdit(subject)"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Edytuj</span>
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