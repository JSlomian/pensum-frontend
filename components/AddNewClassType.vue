<script setup lang="ts">
const props = defineProps(['route'])
const type = ref('')
const abbreviation = ref('')
const addNew = ref(false)
const hasErrors = ref(false)
const {callPost} = usePost(props.route)

const emit = defineEmits(['success'])


const handleSubmit = async () => {
  try {
    await callPost({type: type.value, abbreviation: abbreviation.value})
    emit('success');
    type.value = ''
    abbreviation.value = ''
    addNew.value = false
    hasErrors.value = false
  } catch (e) {
    hasErrors.value = true
  }
}

const abortAddNew = () => {
  type.value = ''
  abbreviation.value = ''
  addNew.value = false
  hasErrors.value = false
}

</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button @click="addNew = !addNew" id="add-new-btn"
            class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
      Dodaj
    </button>
  </div>

  <!-- Add New Form -->
  <div v-else id="add-new-form" class="bg-white p-4 rounded-md shadow-md border border-gray-200 mb-6">
    <h3 class="text-lg font-medium text-gray-700 mb-4">Dodaj nową formę zajęć</h3>
    <form id="form" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <!-- Name Input -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nazwa zajęć</label>
          <input
              v-model="type"
              type="text"
              id="name"
              maxlength="50"
              class="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nazwa zajęć"
              required
          />
        </div>

        <!-- Abbreviation Input -->
        <div>
          <label for="abbreviation" class="block text-sm font-medium text-gray-700">Skrót</label>
          <input
              v-model="abbreviation"
              type="text"
              id="abbreviation"
              maxlength="5"
              class="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="skr."
              required
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-4 flex justify-end">
        <button
            type="submit"
            class="px-4 py-2 ml-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Dodaj
        </button>
        <button
            type="reset"
            @click="abortAddNew"
            class="px-4 py-2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Anuluj
        </button>

        </div>
      <div v-if="hasErrors" class="block relative mb-4 mt-4 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700" role="alert">
          <strong class="font-bold">Błąd: </strong>
    <span class="block sm:inline">Wystąpił błąd podczas dodawania formy zajęć, spróbuj ponownie</span>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>