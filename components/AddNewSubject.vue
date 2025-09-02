<script setup lang="ts">
const props = defineProps<{
  programId: number
}>()
const route = '/api/subjects'
const name = ref<string>('')
const program = ref<string>(`/programs/${props.programId}`)
const addNew = ref<boolean>(false)
const hasErrors = ref<boolean>(false)
const { callPost } = usePost(route)

const emit = defineEmits(['success'])

const handleSubmit = async () => {
  try {
    await callPost({
      name: name.value,
      program: program.value,
    } satisfies SubjectCreate)
    await showToast('success', `Dodano nowy przedmiot ${name.value}`)
    emit('success')
    name.value = ''
    addNew.value = false
    hasErrors.value = false
  } catch (e) {
    hasErrors.value = true
    await showToast('danger', `Nie udało się dodać ${name.value}`)
  }
}

const abortAddNew = () => {
  name.value = ''
  addNew.value = false
  hasErrors.value = false
}
</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button
      type="button"
      class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
      @click="addNew = !addNew"
    >
      Dodaj nowy przedmiot
    </button>
  </div>

  <!-- Add New Form -->
  <div
    v-else
    class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mb-5"
  >
    <div class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowy przedmiot</h5>
      <div class="relative z-0 w-full mb-5 group">
        <input
          id="name"
          v-model="name"
          type="text"
          maxlength="255"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="name"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Pełna Nazwa
        </label>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          @click="handleSubmit"
        >
          Dodaj
        </button>
        <button
          type="button"
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          @click="abortAddNew"
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
