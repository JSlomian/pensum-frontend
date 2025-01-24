<script setup lang="ts">
import AddNewClassType from "~/components/AddNewClassType.vue";

const { data } = await useFetch('/api/class-types')

const emits = defineEmits('')

</script>

<template>

<div class="container mx-auto p-6">
  <AddNewClassType />
  <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            #
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Role
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Row 1 -->
        <tr v-for="classType in data.member" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{classType.id}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{classType.type}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{classType.abbreviation}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
            <button class="px-4 py-2 ml-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</template>

<style scoped>

</style>