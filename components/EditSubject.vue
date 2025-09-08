<script setup lang="ts">
  const ctRoute = '/api/class_types'

  const props = defineProps<{
    subject: Subject
    program: Program
  }>()
  const route = `/api/subjects`
  const usrRoute = `/api/users?hoursYear=${props.program.planYear}&exists[position.pensum]=true`

  let editable = reactive<Subject>(JSON.parse(JSON.stringify(props.subject)))
  watch(
    () => props.subject,
    (newVal) => {
      editable = reactive<Subject>(JSON.parse(JSON.stringify(newVal)))
    }
  )

  const emits = defineEmits(['abort', 'success'])
  const { data: classTypes } = await useFetch<{ member: ClassType[] }>(ctRoute)
  const { data: users } = await useFetch<{ member: ApiUser[] }>(usrRoute)

  const onAmountChangeGroups = (iri: string, value: number) => {
    if (value === null || value === undefined || isNaN(value)) return
    const group = editable.subjectGroups.find(
      (g) => g.classType['@id'] === iri || g.classType === iri
    )

    if (group) {
      group.amount = value
    } else {
      if (editable['@id'] && value !== 0) {
        editable.subjectGroups.push({
          classType: iri,
          amount: value,
          subject: editable['@id'],
        } satisfies SubjectGroupCreate)
      }
    }
  }
  const onAmountChangeHours = (iri: string, value: number) => {
    if (value === null || value === undefined || isNaN(value)) return
    const group = editable.subjectHours.find(
      (g) => g.classType['@id'] === iri || g.classType === iri
    )

    if (group) {
      group.hoursRequired = value
    } else {
      if (editable['@id'] && value !== 0) {
        editable.subjectHours.push({
          classType: iri,
          hoursRequired: value,
          subject: editable['@id'],
        } satisfies SubjectHoursCreate)
      }
    }
  }

  const handleUpdate = async (subject: Subject): Promise<void> => {
    const updatedSubject = {
      ...subject,
      //   roles: [roleSelect.value],
      //   institute: editUnitIri.value || '',
      //   position: editPosIri.value || ''
    }

    await useUpdate(route).callUpdate(updatedSubject as Subject, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Zaktualizowano ${subject.name}`)
          emits('success')
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się zaktualizować.`)
      },
    })
  }
  const removeLecturer = (i: number) => {
    editable.subjectLecturers.splice(i, 1)
  }

  const addSubjectLecturer = () => {
    const newLecturer: SubjectLecturerCreate = {
      subject: editable['@id'],
      classType: '',
      user: '',
      subjectHours: 0,
    }
    editable.subjectLecturers.push(newLecturer)
  }
</script>

<template>
  <form @submit.prevent>
    <div class="w-100 text-right">
      <span
        class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
        @click="handleUpdate(editable)"
        >Zapisz</span
      >
      <span
        class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
        @click="emits('abort')"
        >Anuluj</span
      >
    </div>
    <div class="mb-6">
      <label for="name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >Przedmiot</label
      >
      <input
        id="name"
        v-model="editable.name"
        type="text"
        maxlength="255"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ilość grup</h2>
    <div
      v-if="classTypes?.member"
      :class="`mb-6 grid gap-6 grid-cols-${classTypes?.member?.length || '6'}`"
    >
      <template v-if="classTypes?.member">
        <div v-for="ct in classTypes?.member as ClassType[]" :key="ct.id" class="col-span-1">
          <label for="last_name" class="mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
            ct.type
          }}</label>
          <input
            id="last_name"
            type="number"
            maxlength="255"
            :value="
              editable.subjectGroups.find(
                (g) => g.classType['@id'] === ct['@id'] || g.classType === ct['@id']
              )?.amount || ''
            "
            required
            @input="onAmountChangeGroups(ct['@id'], Number($event.target.value))"
            class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </template>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ilość godzin wymaganych</h2>
    <div
      v-if="classTypes?.member"
      :class="`mb-6 grid gap-6 grid-cols-${classTypes?.member?.length || '6'}`"
    >
      <template v-if="classTypes?.member">
        <div v-for="ct in classTypes?.member as ClassType[]" :key="ct.id" class="col-span-1">
          <label :for="ct.type" class="mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
            ct.type
          }}</label>
          <input
            :id="ct.type"
            type="number"
            maxlength="255"
            :value="
              editable.subjectHours.find(
                (g) => g.classType['@id'] === ct['@id'] || g.classType === ct['@id']
              )?.hoursRequired || ''
            "
            required
            @input="onAmountChangeHours(ct['@id'], Number($event.target.value))"
            class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </template>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
      Przydziały
      <button
        type="button"
        class="mb-2 me-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
        @click="addSubjectLecturer"
      >
        Dodaj
      </button>
    </h2>
    <div class="mb-6 grid grid-cols-[auto_1fr_1fr_auto] gap-6">
      <template
        v-for="(sl, index) in editable.subjectLecturers as (
          | SubjectLecturerCreate
          | SubjectLecturer
        )[]"
        :key="index"
      >
        <div>
          <label for="sl" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Ilość godzin</label
          >
          <input
            id="sl"
            v-model="sl.subjectHours"
            type="number"
            maxlength="255"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label for="role" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Forma zajęć</label
          >
          <select
            v-model="sl.classType"
            name="role"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Wybierz formę zajęć</option>
            <template v-if="classTypes?.member && classTypes?.member?.length > 0">
              <option
                v-for="ct in classTypes.member as ClassType[]"
                :key="ct['@id']"
                :value="ct['@id']"
              >
                {{ ct.type }}
              </option>
            </template>
          </select>
        </div>
        <div>
          <label for="lecturer" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Wykładowca</label
          >
          <select
            v-model="sl.user"
            name="lecturer"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Wybierz wykładowcę</option>
            <template v-if="users?.member && users?.member?.length > 0">
              <option
                v-for="usr in users.member as ApiUser[]"
                :key="usr['@id']"
                :value="usr['@id']"
              >
                {{ usr.first_name }} {{ usr.last_name }} {{ usr.hoursUsed }}/{{
                  usr.position.pensum
                }}
              </option>
            </template>
          </select>
        </div>

        <div class="mt-7 flex items-center justify-center self-start">
          <button
            type="button"
            class="mb-1 me-1 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            @click="removeLecturer(index)"
          >
            <svg
              class="text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
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

<style scoped></style>
