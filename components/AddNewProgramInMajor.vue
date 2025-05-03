<script setup lang="ts">
const props = defineProps(['route'])
const majorsRoute = '/api/majors'
const educationLevelsRoute = '/api/education_levels'
const attendanceModesRoute = '/api/attendance_modes'
const {data: major, status: majorStatus} = await useFetch<{ member: Major[] }>(majorsRoute)
const {data: educationLevel, status: educationLevelStatus} = await useFetch<{
  member: EducationLevel[]
}>(educationLevelsRoute)
const {data: attendanceMode, status: attendanceModeStatus} = await useFetch<{
  member: AttendanceMode[]
}>(attendanceModesRoute)
const majorIri = ref<string>('')
const educationLevelIri = ref<string>('')
const attendanceModeIri = ref<string>('')
const addNew = ref<boolean>(false)
const hasErrors = ref<boolean>(false)
const {callPost} = usePost(props.route)

const emit = defineEmits(['success'])

onMounted(() => {
  if (majorStatus.value == 'success') {
    majorIri.value = major.value!.member[0]['@id']
  }
  if (educationLevelStatus.value == 'success') {
    educationLevelIri.value = educationLevel.value!.member[0]['@id']
  }
  if (attendanceModeStatus.value == 'success') {
    attendanceModeIri.value = attendanceMode.value!.member[0]['@id']
  }
})

const handleSubmit = async () => {
  try {
    let res = await callPost({
      major: majorIri.value,
      educationLevel: educationLevelIri.value,
      attendanceMode: attendanceModeIri.value
    } satisfies ProgramInMajorCreate)
    if (res.statusCode) {
      hasErrors.value = true
      await showToast("danger", `Nie udało się dodać`)
      if (res.statusCode === 422) {
        await showToast("danger", `Taka kombinacja już istnieje`)
      }
    } else {
      await showToast("success", `Dodano nowy program.`)
      emit('success');
    }
    majorIri.value = major.value!.member[0]['@id']
    educationLevelIri.value = educationLevel.value!.member[0]['@id']
    attendanceModeIri.value = attendanceMode.value!.member[0]['@id']
    addNew.value = false
    hasErrors.value = false
  } catch (e) {

  }
}

const abortAddNew = () => {
  majorIri.value = major.value!.member[0]['@id']
  educationLevelIri.value = educationLevel.value!.member[0]['@id']
  attendanceModeIri.value = attendanceMode.value!.member[0]['@id']
  addNew.value = false
  hasErrors.value = false
}

</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button @click="addNew = !addNew"
            type="button"
            class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
      Dodaj
    </button>
  </div>

  <!-- Add New Form -->
  <div v-else
       class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mb-5">
    <div class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowy program</h5>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <label for="underline_select" class="sr-only">Wybierz kierunek</label>
          <select id="underline_select" v-model="majorIri" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option
                v-if="major?.member && major?.member?.length > 0"
                v-for="maj in major?.member"
                :key="maj['@id']"
                :value="maj['@id']">{{ maj.name }}
            </option>
          </select>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <label for="underline_select" class="sr-only">Wybierz poziom edukacji</label>
          <select id="underline_select" v-model="educationLevelIri" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option
                v-if="educationLevel?.member && educationLevel?.member?.length > 0"
                v-for="el in educationLevel?.member"
                :key="el['@id']"
                :value="el['@id']">{{ el.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <label for="underline_select" class="sr-only">Wybierz tryb uczęszczania</label>
          <select id="underline_select" v-model="attendanceModeIri" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option
                v-if="attendanceMode?.member && attendanceMode?.member?.length > 0"
                v-for="am in attendanceMode?.member"
                :key="am['@id']"
                :value="am['@id']">{{ am.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="button" @click="handleSubmit"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Dodaj
        </button>
        <button type="button" @click="abortAddNew"
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>