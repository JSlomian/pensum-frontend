<script lang="ts">
const unitsRoute = '/api/institutes'
const posRoute = '/api/positions'

const props = defineProps<{
  user: ApiUser,
  route: string,
}>()

const editable = reactive<ApiUser>(structuredClone(props.user))

const emits = defineEmits(['abort', 'success'])

const {callUpdate} = useUpdate(props.route)
const editUnitIri = ref<string>('')
const editPosIri = ref<string>('')
const {data: institutes} = await useFetch<{ member: Institute[] }>(unitsRoute)
const {data: positions} = await useFetch<{ member: Position[] }>(posRoute)

const positionChosenWhileEditing = computed(() => {
      return positions.value?.member?.find((p: Position) => p['@id'] === editPosIri.value)
    }
)

const handleUpdate = (user: ApiUser): void => {
  try {
    const updatedUser = {
      ...user,
      institute: editUnitIri.value || '',
      position: editPosIri.value || ''
    } satisfies ApiUserEdit

    callUpdate(updatedUser)
    emits('success')
    showToast('success', `Zaktualizowano ${user.first_name} ${user.last_name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}

</script>

<template>

  <form @submit.prevent>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imię</label>
        <input type="text" id="first_name" v-model="editable.first_name"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required/>
      </div>
      <div>
        <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
        <input type="text" id="last_name"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Doe" required/>
      </div>
      <div>
        <label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
        <input type="text" id="company"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Flowbite" required/>
      </div>
      <div>
        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
        <input type="tel" id="phone"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required/>
      </div>
      <div>
        <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
        <input type="url" id="website"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="flowbite.com" required/>
      </div>
      <div>
        <label for="visitors" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique visitors (per
          month)</label>
        <input type="number" id="visitors"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="" required/>
      </div>
    </div>
    <div class="mb-6">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
      <input type="email" id="email"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             placeholder="john.doe@company.com" required/>
    </div>
    <div class="mb-6">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
      <input type="password" id="password"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             placeholder="•••••••••" required/>
    </div>
    <div class="mb-6">
      <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
        password</label>
      <input type="password" id="confirm_password"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             placeholder="•••••••••" required/>
    </div>
    <div class="flex items-start mb-6">
      <div class="flex items-center h-5">
        <input id="remember" type="checkbox" value=""
               class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
               required/>
      </div>
      <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a
          href="#" class="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
    </div>
    <button type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Submit
    </button>
  </form>

</template>

<style scoped>

</style>