<script setup lang="ts">
const unitsRoute = '/api/institutes'
const posRoute = '/api/positions'

const props = defineProps<{
  user: ApiUser
  route: string
}>()

let editable = reactive<ApiUser>(JSON.parse(JSON.stringify(props.user)))
watch(
  () => props.user,
  (newVal) => {
    editable = reactive<ApiUser>(JSON.parse(JSON.stringify(newVal)))
  }
)

const emits = defineEmits(['abort', 'success'])
const { callUpdate } = useUpdate(props.route)
const editUnitIri = ref<string>(editable.institute?.['@id'] || '')
const editPosIri = ref<string>(editable.position?.['@id'] || '')
const roleSelect = ref<string>(editable.roles[0] || 'ROLE_USER')
const { data: institutes } = await useFetch<{ member: Institute[] }>(unitsRoute, { lazy: true })
const { data: positions } = await useFetch<{ member: Position[] }>(posRoute, { lazy: true })

const positionChosenWhileEditing = computed(() => {
  return positions.value?.member?.find((p: Position) => p['@id'] === editPosIri.value)
})

const handleUpdate = (user: ApiUser): void => {
  try {
    const updatedUser = {
      ...user,
      roles: [roleSelect.value],
      institute: editUnitIri.value || '',
      position: editPosIri.value || '',
    } satisfies ApiUserCreate

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
    <div class="w-100 text-right">
      <span
        class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
        @click="handleUpdate(editable)"
        >Zapisz</span
      >
      <span
        class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
        @click="emits('abort')"
        >Anuluj</span
      >
    </div>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Imię</label
        >
        <input
          id="first_name"
          v-model="editable.first_name"
          type="text"
          maxlength="255"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Nazwisko</label
        >
        <input
          id="last_name"
          v-model="editable.last_name"
          type="text"
          maxlength="255"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >E-mail</label
        >
        <input
          id="email"
          v-model="editable.email"
          type="email"
          maxlength="180"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Rola w systemie</label
        >
        <select
          v-model="roleSelect"
          name="role"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="ROLE_USER">Użytkownik</option>
          <option value="ROLE_ADMIN">Administrator</option>
        </select>
      </div>
      <div>
        <label for="unit_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Jednostka Organizacyjna</label
        >
        <select
          v-model="editUnitIri"
          name="unit_name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
      <div>
        <label for="pos_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Stanowisko</label
        >
        <select
          v-model="editPosIri"
          name="ps_name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
      <div>
        <label for="pensum" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Pensum stanowiska</label
        >
        <input
          id="pensum"
          type="text"
          :value="positionChosenWhileEditing?.pensum"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          disabled
        />
      </div>
      <div>
        <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Opis stanowiska</label
        >
        <input
          id="desc"
          type="text"
          :value="positionChosenWhileEditing?.description"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          disabled
        />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
