<script setup lang="ts">
const ctRoute = '/api/class_types'

const props = defineProps<{
  subject: Subject,
  program: Program
}>()
const route = `/api/subjects`
const usrRoute = `/api/users?hoursYear=${props.program.planYear}&exists[position.pensum]=true`

let editable = reactive<Subject>(JSON.parse(JSON.stringify(props.subject)))
watch(() => props.subject, (newVal) => {
  editable = reactive<Subject>(JSON.parse(JSON.stringify(newVal)))
})

const emits = defineEmits(['abort', 'success'])
const {callUpdate} = useUpdate(route)
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)
const {data: users} = await useFetch<{ member: ApiUser[] }>(usrRoute)


const onAmountChangeGroups = (iri: string, value: number) => {
  if (value === null || value === undefined || isNaN(value)) return
  const group = editable.subjectGroups.find(g => g.classType["@id"] === iri || g.classType === iri)

  if (group) {
    group.amount = value
  } else {
    if (editable['@id'] && value !== 0) {
      editable.subjectGroups.push({
        classType: iri,
        amount: value,
        subject: editable['@id']
      } as any)
    }
  }
}
const onAmountChangeHours = (iri: string, value: number) => {
  if (value === null || value === undefined || isNaN(value)) return
  const group = editable.subjectHours.find(g => g.classType["@id"] === iri || g.classType === iri)

  if (group) {
    group.hoursRequired = value
  } else {
    if (editable['@id'] && value !== 0) {
      editable.subjectHours.push({
        classType: iri,
        requiredHours: value,
        subject: editable['@id']
      } as any)
    }
  }
}

const handleUpdate = (subject: Subject): void => {
  try {
    console.log(subject)

    const updatedSubject = {
      ...subject,
      //   roles: [roleSelect.value],
      //   institute: editUnitIri.value || '',
      //   position: editPosIri.value || ''
    }

    callUpdate(updatedSubject)
    emits('success')
    showToast('success', `Zaktualizowano ${subject.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}
const removeLecturer = (i: number) => {
  console.log(editable.subjectLecturers)
  editable.subjectLecturers.splice(i, 1)
  console.log(editable.subjectLecturers)
}

const addSubjectLecturer = () => {
  const newLecturer: SubjectLecturerCreate = {
    subject: editable['@id'],
    classType: '',
    user: '',
    subjectHours: 0
  }
  editable.subjectLecturers.push(newLecturer)
}

</script>

<template>
  <form @submit.prevent>
    <div class="w-100 text-right">
      <span @click="handleUpdate(editable)"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
      <span @click="emits('abort')"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
    </div>
    <div class="mb-6">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Przedmiot</label>
      <input type="text" id="name" v-model="editable.name" maxlength="255"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             required/>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ilość grup</h2>
    <div v-if="classTypes?.member" :class="`grid gap-6 mb-6 grid-cols-${classTypes?.member?.length || '6'}`">
      <div
          class="col-span-1"
          v-if="classTypes?.member"
          v-for="ct in classTypes?.member as ClassType[]" :key="ct.id">
        <label for="last_name" class=" mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ ct.type }}</label>
        <input type="number" id="last_name"
               maxlength="255"
               :value="editable.subjectGroups.find(g => g.classType['@id'] === ct['@id'] || g.classType === ct['@id'])?.amount || ''"
               @input="onAmountChangeGroups(ct['@id'], Number($event.target.value))"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required/>
      </div>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ilość godzin wymaganych</h2>
    <div v-if="classTypes?.member" :class="`grid gap-6 mb-6 grid-cols-${classTypes?.member?.length || '6'}`">
      <div
          class="col-span-1"
          v-if="classTypes?.member"
          v-for="ct in classTypes?.member as ClassType[]" :key="ct.id">
        <label :for="ct.type" class=" mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ ct.type }}</label>
        <input type="number" :id="ct.type" maxlength="255"
               :value="editable.subjectHours.find(g => g.classType['@id'] === ct['@id'] || g.classType === ct['@id'])?.hoursRequired || ''"
               @input="onAmountChangeHours(ct['@id'], Number($event.target.value))"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required/>
      </div>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
      Przydziały
      <button @click="addSubjectLecturer"
              type="button"
              class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
        Dodaj
      </button>
    </h2>
    <div class="grid gap-6 mb-6 grid-cols-[auto_1fr_1fr_auto]">
      <template v-for="(sl, index) in editable.subjectLecturers as (SubjectLecturerCreate | SubjectLecturer)[]">
        <div>
          <label for="sl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ilość godzin</label>
          <input type="number" id="sl" maxlength="255"
                 v-model="sl.subjectHours"
                 class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div><label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Forma zajęć</label>
          <select v-model="sl.classType" name="role"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="" disabled>Wybierz formę zajęć</option>
            <option
                v-if="classTypes?.member && classTypes?.member?.length > 0"
                v-for="ct in classTypes.member as ClassType[]"
                :key="ct['@id']"
                :value="ct['@id']"
            >
              {{ ct.type }}
            </option>
          </select></div>
        <div>
          <label for="lecturer" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Wykładowca</label>
          <select v-model="sl.user" name="lecturer"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="" disabled>Wybierz wykładowcę</option>
            <option
                v-if="users?.member && users?.member?.length > 0"
                v-for="usr in users.member as ApiUser[]"
                :key="usr['@id']"
                :value="usr['@id']"
            >
              {{ usr.first_name }} {{ usr.last_name }} {{ usr.hoursUsed }}/{{ usr.position.pensum }}
            </option>
          </select>
        </div>

        <div class="self-start flex items-center justify-center mt-7">
          <button type="button" @click="removeLecturer(index)"
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 me-1 mb-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            <svg class=" text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
            </svg>
          </button>
        </div>
      </template>
    </div>

    <!--      <div>-->
    <!--        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>-->
    <!--        <input type="email" id="email" v-model="editable.email" maxlength="180"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               required/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rola w stystemie</label>-->
    <!--        <select v-model="roleSelect" name="role"-->
    <!--                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option value="ROLE_USER">-->
    <!--            Użytkownik-->
    <!--          </option>-->
    <!--          <option value="ROLE_ADMIN">-->
    <!--            Administrator-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="unit_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jednostka-->
    <!--          Organizacyjna</label>-->
    <!--        <select-->
    <!--            name="unit_name"-->
    <!--            v-model="editUnitIri"-->
    <!--            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option-->
    <!--              v-if="institutes?.member && institutes?.member?.length > 0"-->
    <!--              v-for="institute in institutes?.member as Institute[]"-->
    <!--              :value="institute['@id']"-->
    <!--              :key="institute['@id']"-->
    <!--          >-->
    <!--            {{ institute.name }} {{ institute.abbreviation }}-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="pos_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stanowisko</label>-->
    <!--        <select-->
    <!--            name="ps_name"-->
    <!--            v-model="editPosIri"-->
    <!--            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option-->
    <!--              v-if="positions?.member && positions?.member?.length > 0"-->
    <!--              v-for="position in positions?.member as Position[]"-->
    <!--              :value="position['@id']"-->
    <!--              :key="position['@id']"-->
    <!--          >-->
    <!--            {{ position.title }}-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="pensum" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pensum-->
    <!--          stanowiska</label>-->
    <!--        <input type="text" id="pensum" :value="positionChosenWhileEditing?.pensum"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               disabled/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Opis stanowiska</label>-->
    <!--        <input type="text" id="desc" :value="positionChosenWhileEditing?.description"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               disabled/>-->
    <!--      </div>-->
    <!--    </div>-->
  </form>

</template>

<style scoped>

</style>