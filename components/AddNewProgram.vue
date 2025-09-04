<script setup lang="ts">
  const props = defineProps({
    route: {
      default: '',
      required: false,
      type: String,
    },
  })
  const pimsRoute = '/api/programs_in_majors'
  const { data: pims, status: pimStatus } = await useFetch<{ member: ProgramInMajor[] }>(pimsRoute)
  const pimIri = ref<string>('')
  const planYear = ref<number>(new Date().getFullYear())
  const syllabusYear = ref<number>(new Date().getFullYear())
  const semester = ref<number>(1)
  const addNew = ref<boolean>(false)
  const hasErrors = ref<boolean>(false)
  const { callPost } = usePost(props.route)

  const emit = defineEmits(['success'])

  onMounted(() => {
    if (pimStatus.value == 'success') {
      pimIri.value = pims.value!.member[0]['@id']
    }
  })

  const handleSubmit = async () => {
    try {
      const res = await callPost({
        programInMajors: pimIri.value,
        semester: semester.value,
        planYear: planYear.value,
        syllabusYear: syllabusYear.value,
      } satisfies ProgramCreate)
      if (res.data.value.statusCode) {
        hasErrors.value = true
        await showToast('danger', `Nie udało się dodać.`)
        if (res.data.value.statusCode === 422) {
          await showToast('danger', `Taka kombinacja już istnieje.`)
        }
      } else {
        await showToast('success', `Dodano nowy program.`)
        emit('success')
      }
      pimIri.value = pims.value!.member[0]['@id']
      addNew.value = false
      hasErrors.value = false
    } catch (e) {}
  }

  const abortAddNew = () => {
    pimIri.value = pims.value!.member[0]['@id']
    addNew.value = false
    hasErrors.value = false
  }
</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button
      type="button"
      class="mb-2 me-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
      @click="addNew = !addNew"
    >
      Dodaj
    </button>
  </div>

  <!-- Add New Form -->
  <div
    v-else
    class="mb-5 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8"
  >
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowy program</h5>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <label for="underline_select" class="sr-only">Wybierz program na kierunku</label>
          <select
            id="underline_select"
            v-model="pimIri"
            required
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
          >
            <template v-if="pims?.member && pims?.member?.length > 0">
              <option
                v-for="pim in pims?.member as ProgramInMajor[]"
                :key="pim['@id']"
                :value="pim['@id']"
              >
                {{ pim.major.name }}-{{ pim.educationLevel.abbreviation }}-{{
                  pim.attendanceMode.abbreviation
                }}
              </option>
            </template>
          </select>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="semester"
            type="number"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
            min="1"
            max="10"
            @keydown.e.prevent
            @keydown.E.prevent
            @keydown.plus.prevent
            @keydown.minus.prevent
            @keydown.dot.prevent
          />
          <label
            for="semester"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Semestr
          </label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="planYear"
            type="number"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            required
            :min="1980"
            :max="2100"
            step="1"
            @keydown.e.prevent
            @keydown.E.prevent
            @keydown.plus.prevent
            @keydown.minus.prevent
            @keydown.dot.prevent
          />
          <label
            for="planYear"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Rok
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="syllabusYear"
            type="number"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            required
            :min="1980"
            :max="2100"
            step="1"
            @keydown.e.prevent
            @keydown.E.prevent
            @keydown.plus.prevent
            @keydown.minus.prevent
            @keydown.dot.prevent
          />
          <label
            for="syllabusYear"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Program sylabusowy
          </label>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          type="submit"
          class="mb-2 me-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Dodaj
        </button>
        <button
          type="button"
          @click="abortAddNew"
          class="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Anuluj
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
