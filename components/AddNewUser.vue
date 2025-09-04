<script setup lang="ts">
  const props = defineProps({
    route: {
      default: '',
      required: false,
      type: String,
    },
  })
  const unitRoute = '/api/institutes'
  const posRoute = '/api/positions'
  const { data: institutes, status: unitsStatus } = useFetch<{ member: Institute[] }>(unitRoute)
  const { data: positions, status: positionsStatus } = useFetch<{ member: Position[] }>(posRoute)
  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const email = ref<string>('')
  const role = ref<string>('ROLE_USER')
  const instituteIri = ref<string>('')
  const positionIri = ref<string>('')
  const addNew = ref<boolean>(false)
  const hasErrors = ref<boolean>(false)
  const { callPost } = usePost(props.route)

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
        position: positionIri.value,
      } satisfies ApiUserCreate)
      await showToast('success', `Dodano nowego użytkownika ${firstName.value} ${lastName.value}`)
      emit('success')
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
      await showToast('danger', `Nie udało się dodać ${firstName.value} ${lastName.value}`)
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
  })
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
    <div class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowego użytkownika</h5>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            maxlength="255"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="firstName"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Imię
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            maxlength="255"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="lastName"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Nazwisko
          </label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            id="email"
            v-model="email"
            type="email"
            maxlength="255"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="email"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Email
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <label for="role" class="sr-only">Rola</label>
          <select
            id="role"
            v-model="role"
            required
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
          >
            <option value="ROLE_USER">Użytkownik</option>
            <option value="ROLE_ADMIN">Administrator</option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <label for="institute" class="sr-only">Wybierz jednostkę</label>
          <select
            id="institute"
            v-model="instituteIri"
            required
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
          >
            <template v-if="institutes?.member && institutes?.member?.length > 0">
              <option
                v-for="institute in institutes?.member as Institute[]"
                :key="institute['@id']"
                :value="institute['@id']"
              >
                {{ institute.name }} {{ institute.abbreviation }}
              </option>
            </template>
          </select>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <label for="position" class="sr-only">Wybierz jednostkę</label>
          <select
            id="position"
            v-model="positionIri"
            required
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
          >
            <template v-if="positions?.member && positions?.member?.length > 0">
              <option
                v-for="position in positions?.member as Position[]"
                :key="position['@id']"
                :value="position['@id']"
              >
                {{ position.title }}
              </option>
            </template>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            id="pensum"
            type="text"
            :value="positionChosenWhileEditing?.pensum"
            disabled
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          />
          <label
            for="pensum"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Pensum stanowiska
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            id="firstName"
            type="text"
            :value="positionChosenWhileEditing?.description"
            disabled
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          />
          <label
            for="firstName"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Opis stanowiska
          </label>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="mb-2 me-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          @click="handleSubmit"
        >
          Dodaj
        </button>
        <button
          type="button"
          class="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          @click="abortAddNew"
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
