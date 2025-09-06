<script setup lang="ts">
  const props = defineProps<{
    programId: number
  }>()
  const route = '/api/import-subjects'
  const name = ref<string>('')
  const programToCopyId = ref<number>(0)
  const addNew = ref<boolean>(false)
  const { data: programs } = await useFetch<{ member: Program[] }>('/api/programs')

  const emit = defineEmits(['success', 'hide-add-new', 'abort'])

  const handleSubmit = async () => {
    await usePost(route).callPost(
      {
        currentProgram: props.programId,
        programToImport: programToCopyId.value,
      } satisfies {currentProgram: number, programToImport: number},
      {
        onResponse({ response }: { response: Response }) {
          if (response.ok) {
            showToast('success', `Zaimportowano ${response._data.copied}`)
            emit('success')
            name.value = ''
            addNew.value = false
          }
        },
        onResponseError() {
          showToast('danger', `Nie udało się zaimportować`)
        },
      }
    )
  }
  const abortAddNew = () => {
    name.value = ''
    addNew.value = false
    emit('abort')
  }
  const importButtonClick = () => {
    addNew.value = !addNew.value
    emit('hide-add-new')
  }
</script>

<template>
  <!-- Add New Button -->
  <div v-if="!addNew" class="mb-4 flex justify-end">
    <button
      type="button"
      class="mb-2 me-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
      @click="importButtonClick"
    >
      Importuj przydziały
    </button>
  </div>

  <!-- Add New Form -->
  <div
    v-else
    class="mb-5 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8"
  >
    <div class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Wybierz program z którego importować przydziały</h5>
      <div class="group relative z-0 mb-5 w-full">
        <label for="underline_select" class="sr-only">Wybierz program na kierunku</label>
        <select
          id="underline_select"
          v-model="programToCopyId"
          required
          class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
        >
          <template v-if="programs?.member && programs?.member?.length > 0">
            <option
              v-for="prog in programs?.member as Program[]"
              :key="prog['@id']"
              :value="prog['id']"
            >
              {{
                prog.programInMajors.major.abbreviation +
                '-' +
                prog.programInMajors.educationLevel.abbreviation +
                '-' +
                prog.programInMajors.attendanceMode.abbreviation
              }}
              Sem: {{ prog.semester }} Rok: {{ prog.planYear }}({{ prog.syllabusYear }})
            </option>
          </template>
        </select>
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
