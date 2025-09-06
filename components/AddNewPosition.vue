<script setup lang="ts">
  const props = defineProps({
    route: {
      default: '',
      required: false,
      type: String,
    },
  })

  const position = reactive<PositionCreate>({
    title: '',
    description: '',
    pensum: null,
    abbreviation: '',
  })

  const addNew = ref<boolean>(false)

  const emit = defineEmits(['success'])

  const handleSubmit = async () => {
    await usePost(props.route).callPost(position satisfies PositionCreate, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Dodano nowe stanowisko ${position.title}`)
          emit('success')
          abortAddNew()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się dodać ${position.title}`)
      },
    })
  }

  const abortAddNew = () => {
    position.title = ''
    position.description = ''
    position.pensum = null
    position.abbreviation = ''
    addNew.value = false
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
    <div class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Dodaj nowe stanowisko</h5>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="position.title"
            type="text"
            maxlength="255"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="title"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Tytuł
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="position.abbreviation"
            type="text"
            maxlength="30"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="abbreviation"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Skrót
          </label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="group relative z-0 mb-5 w-full">
          <input
            v-model="position.description"
            type="text"
            maxlength="255"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="title"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Stanowisko
          </label>
        </div>
        <div class="group relative z-0 mb-5 w-full">
          <input
            type="number"
            v-model="position.pensum"
            class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
          />
          <label
            for="abbreviation"
            class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Pensum
          </label>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          @click="handleSubmit"
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
    </div>
  </div>
</template>

<style scoped></style>
