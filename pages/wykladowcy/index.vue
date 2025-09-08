<script setup lang="ts">
  const route = '/api/users'
  useHead({
    title: 'Wykładowcy',
  })

  definePageMeta({
    middleware: 'require-roles',
    requiresRoles: ['ROLE_ADMIN'],
  })

  const { data, refresh } = await useFetch<{ member: ApiUser[] }>(route)
  const editId = ref<number>(0)

  const deleteId = ref<number>(0)
  const modalOpen = ref<boolean>(false)
  const modalText = ref<string>('')

  const handleDelete = async (id: number): Promise<void> => {
    const user: ApiUser | undefined = data.value?.member.find((u: ApiUser) => u.id === id)
    if (!user) {
      showToast('danger', 'Przekazano id do nieistniejącej pozycji')
      modalOpen.value = false
      return
    }
    await useDelete(route).callDelete(user.id, {
      onResponse({ response }: { response: Response }) {
        if (response.ok) {
          showToast('success', `Usunięto ${user.first_name} ${user.last_name}`)
          handleCancelEdit()
        }
      },
      onResponseError() {
        showToast('danger', `Nie udało się usunąć.`)
      },
    })
  }

  const handleCancelEdit = (): void => {
    editId.value = 0
    modalOpen.value = false
    refresh()
  }

  const openDeleteModal = (user: ApiUser): void => {
    modalOpen.value = true
    deleteId.value = user.id
    modalText.value = `Czy napewno chcesz usunąć kierunek <span style="font-weight: bold">${user.first_name} ${user.last_name}</span>?`
  }
</script>
<template>
  <div>
    <ModalDelete
      :open="modalOpen"
      :text="modalText"
      @confirm="handleDelete(deleteId)"
      @abort="modalOpen = false"
    />
    <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
      <AddNewUser :route="route" @success="refresh" />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          v-if="data?.member && data?.member?.length > 0"
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400 md:table-fixed rtl:text-right"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr v-if="editId == 0">
              <th scope="col" class="w-12 px-6 py-3">#</th>
              <th scope="col" class="px-6 py-3">Tytuł, Imię i nazwisko</th>
              <th scope="col" class="w-24 px-6 py-3">Pensum</th>
              <th scope="col" class="w-36 px-6 py-3">Jednostka</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Action</span>
              </th>
            </tr>
            <tr v-else>
              <th scope="col" colspan="5" class="px-6 py-3 text-center">Edycja użytkownika</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in data?.member as ApiUser[]"
              :key="user.id"
              class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <template v-if="editId === user.id">
                <td class="px-6 py-4 hover:bg-white dark:hover:bg-gray-800" colspan="5">
                  <EditUser
                    :user="user"
                    :route="route"
                    @abort="handleCancelEdit"
                    @success="handleCancelEdit"
                  />
                </td>
              </template>
              <template v-else>
                <th
                  scope="row"
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {{ index + 1 }}
                </th>
                <td class="px-6 py-4">
                  {{ user.position?.abbreviation || '' }} {{ user.first_name }} {{ user.last_name }}
                </td>
                <td class="w-36 px-6 py-4">
                  {{ user.position?.pensum || '' }}
                </td>
                <td class="w-24 px-6 py-4">
                  {{ user.institute?.abbreviation || 'Brak' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div>
                    <NuxtLink
                      :to="`/raport/${user.id}`"
                      class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >Raport
                    </NuxtLink>
                    <span
                      class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                      @click="editId = user.id"
                      >Edytuj</span
                    >
                    <span
                      class="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500"
                      @click="openDeleteModal(user)"
                      >Usuń</span
                    >
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <AlertWarning
        v-if="data?.member && data?.member?.length == 0"
        message="Brak dostępnych kierunków, dodaj nowy."
      />
    </div>
  </div>
</template>

<style scoped></style>
