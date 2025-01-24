<script setup lang="ts">
const type = ref('')
const abbreviation = ref('')
const addNew = ref(false)


const handleSubmit = async () => {
  // type.value = ''
  // abbreviation.value = ''
  let ww = JSON.stringify({
      type: type.value,
      abbreviation: abbreviation.value
    })
  console.log(ww)
  const data = await $fetch('https://localhost:8000/api/class_types', {
    method: 'POST',
    body: ww,
    headers: {
      'Content-Type': 'application/ld+json',
      'Accept': '*/*'
    }
})
console.log(data)
}


</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button @click="addNew = !addNew" id="add-new-btn" class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
      Add New
    </button>
  </div>

  <!-- Add New Form -->
  <div v-else id="add-new-form" class="bg-white p-4 rounded-md shadow-md border border-gray-200 mb-6">
    <h3 class="text-lg font-medium text-gray-700 mb-4">Add New Entry</h3>
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
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>