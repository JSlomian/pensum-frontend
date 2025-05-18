<script setup lang="ts">
const props = defineProps(['route'])
const unitRoute = '/api/institutes'
const posRoute = '/api/positions'
const {data: institutes, status: unitsStatus} = useFetch<{ member: Institute[] }>(unitRoute)
const {data: positions, status: positionsStatus} = useFetch<{ member: Position[] }>(posRoute)
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const role = ref<string>('ROLE_USER')
const instituteIri = ref<string>('')
const positionIri = ref<string>('')
const addNew = ref<boolean>(false)
const hasErrors = ref<boolean>(false)
const {callPost} = usePost(props.route)

const emit = defineEmits(['success'])

onMounted(() => {
  if (unitsStatus.value == 'success') {
    instituteIri.value = institutes.value!.member[0]['@id']
  }
  if (positionsStatus.value == 'success') {
    positionIri.value = positions.value!.member[0]['@id']
  }
})

const handleSubmit = async (): Promise<void> => {
  try {
    await callPost({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      roles: [role.value],
      institute: instituteIri.value,
      position: positionIri.value
    } satisfies ApiUserCreate)
    await showToast("success", `Dodano nowego użytkownika ${firstName.value} ${lastName.value}`)
    emit('success');
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    role.value = 'ROLE_USER'
    instituteIri.value = institutes.value!.member[0]['@id']
    positionIri.value = positions.value!.member[0]['@id']
    addNew.value = false
    hasErrors.value = false
  } catch (e) {
    hasErrors.value = true
    await showToast("danger", `Nie udało się dodać ${firstName.value} ${lastName.value}`)
  }
}

const abortAddNew = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  role.value = 'ROLE_USER'
  instituteIri.value = institutes.value!.member[0]['@id']
  positionIri.value = positions.value!.member[0]['@id']
  addNew.value = false
  hasErrors.value = false
}

const positionChosenWhileEditing = computed(() => {
      return positions.value?.member?.find((p: Position) => p['@id'] === positionIri.value)
    }
)

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
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowego użytkownika</h5>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <input type="text" id="firstName" v-model="firstName" maxlength="255"
                 class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                 placeholder=" " required>
          <label for="firstName"
                 class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Imię
          </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <input type="text" id="lastName" v-model="lastName" maxlength="255"
                 class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                 placeholder=" " required>
          <label for="lastName"
                 class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Nazwisko
          </label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <input type="email" id="email" v-model="email" maxlength="255"
                 class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                 placeholder=" " required>
          <label for="email"
                 class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Email
          </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <label for="role" class="sr-only">Rola</label>
          <select id="role" v-model="role" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="ROLE_USER">
              Użytkownik
            </option>
            <option value="ROLE_ADMIN">Administrator</option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <label for="institute" class="sr-only">Wybierz jednostkę</label>
          <select id="institute" v-model="instituteIri" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option
                v-if="institutes?.member && institutes?.member?.length > 0"
                v-for="institute in institutes?.member as Institute[]"
                :key="institute['@id']"
                :value="institute['@id']">{{ institute.name }} {{ institute.abbreviation }}
            </option>
          </select>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <label for="position" class="sr-only">Wybierz jednostkę</label>
          <select id="position" v-model="positionIri" required
                  class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option
                v-if="positions?.member && positions?.member?.length > 0"
                v-for="position in positions?.member as Position[]"
                :key="position['@id']"
                :value="position['@id']">
              {{ position.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
          <input type="text" id="pensum" :value="positionChosenWhileEditing?.pensum" disabled
                 class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
          <label for="pensum"
                 class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Pensum stanowiska
          </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <input type="text" id="firstName" :value="positionChosenWhileEditing?.description" disabled
                 class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
          <label for="firstName"
                 class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Opis stanowiska
          </label>
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