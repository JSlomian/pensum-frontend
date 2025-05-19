<script setup lang="ts">
const ctRoute = '/api/class_types'
const posRoute = '/api/positions'

const props = defineProps<{
  subject: Subject,
  route: string,
}>()

let editable = reactive<Subject>(JSON.parse(JSON.stringify(props.subject)))
watch(() => props.subject, (newVal) => {
  editable = reactive<Subject>(JSON.parse(JSON.stringify(newVal)))
})

const emits = defineEmits(['abort', 'success'])
const {callUpdate} = useUpdate(props.route)
// const editUnitIri = ref<string>(editable.institute?.['@id'] || '')
// const editPosIri = ref<string>(editable.position?.['@id'] || '')
// const roleSelect = ref<string>(editable.roles[0] || 'ROLE_USER')
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)
// const {data: positions} = await useFetch<{ member: Position[] }>(posRoute, {lazy: true})

// const positionChosenWhileEditing = computed(() => {
//       return positions.value?.member?.find((p: Position) => p['@id'] === editPosIri.value)
//     }
// )

const handleUpdate = (subject: Subject): void => {
  try {
    // const updatedUser = {
    //   ...user,
    //   roles: [roleSelect.value],
    //   institute: editUnitIri.value || '',
    //   position: editPosIri.value || ''
    // } satisfies ApiUserCreate

    callUpdate(subject)
    emits('success')
    showToast('success', `Zaktualizowano ${subject.name}`)
  } catch (e) {
    showToast('danger', `Nie udało się zaktualizować.`)
  }
}
</script>

<template>
  <form @submit.prevent>
    <div class="w-100 text-right">
      <span @click="handleUpdate(editable)"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Zapisz</span>
      <span @click="emits('abort')"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2">Anuluj</span>
    </div>
    <div class="mb-6">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Przedmiot</label>
      <input type="text" id="name" v-model="editable.name" maxlength="255"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             required/>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ilość grup</h2>
    <div v-if="classTypes?.member" :class="`grid gap-6 mb-6 grid-cols-${classTypes?.member?.length || '6'}`">
      <div
          class="col-span-1"
          v-if="classTypes?.member"
          v-for="ct in classTypes?.member as ClassType[]" :key="ct.id">
          <label for="last_name" class=" mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ct.type}}</label>
          <input type="text" id="last_name" v-model="editable.id" maxlength="255"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
      </div>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Godziny</h2>
        <div v-if="classTypes?.member" :class="`grid gap-6 mb-6 grid-cols-${classTypes?.member?.length || '6'}`">
      <div
          class="col-span-1"
          v-if="classTypes?.member"
          v-for="ct in classTypes?.member as ClassType[]" :key="ct.id">
          <label for="last_name" class=" mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ct.type}}</label>
          <input type="text" id="last_name" v-model="editable.id" maxlength="255"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
      </div>
    </div>
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Przydziały</h2>
    <!--      <div>-->
    <!--        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>-->
    <!--        <input type="email" id="email" v-model="editable.email" maxlength="180"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               required/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rola w stystemie</label>-->
    <!--        <select v-model="roleSelect" name="role"-->
    <!--                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option value="ROLE_USER">-->
    <!--            Użytkownik-->
    <!--          </option>-->
    <!--          <option value="ROLE_ADMIN">-->
    <!--            Administrator-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="unit_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jednostka-->
    <!--          Organizacyjna</label>-->
    <!--        <select-->
    <!--            name="unit_name"-->
    <!--            v-model="editUnitIri"-->
    <!--            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option-->
    <!--              v-if="institutes?.member && institutes?.member?.length > 0"-->
    <!--              v-for="institute in institutes?.member as Institute[]"-->
    <!--              :value="institute['@id']"-->
    <!--              :key="institute['@id']"-->
    <!--          >-->
    <!--            {{ institute.name }} {{ institute.abbreviation }}-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="pos_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stanowisko</label>-->
    <!--        <select-->
    <!--            name="ps_name"-->
    <!--            v-model="editPosIri"-->
    <!--            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">-->
    <!--          <option-->
    <!--              v-if="positions?.member && positions?.member?.length > 0"-->
    <!--              v-for="position in positions?.member as Position[]"-->
    <!--              :value="position['@id']"-->
    <!--              :key="position['@id']"-->
    <!--          >-->
    <!--            {{ position.title }}-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="pensum" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pensum-->
    <!--          stanowiska</label>-->
    <!--        <input type="text" id="pensum" :value="positionChosenWhileEditing?.pensum"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               disabled/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Opis stanowiska</label>-->
    <!--        <input type="text" id="desc" :value="positionChosenWhileEditing?.description"-->
    <!--               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
    <!--               disabled/>-->
    <!--      </div>-->
    <!--    </div>-->
  </form>

</template>

<style scoped>

</style>