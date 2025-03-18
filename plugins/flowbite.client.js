import * as flowbite from 'flowbite';

export default defineNuxtPlugin(() => {
  // nuxtApp.vueApp.use(flowbite);
  if (import.meta.client) {
    import("flowbite")
  }
})