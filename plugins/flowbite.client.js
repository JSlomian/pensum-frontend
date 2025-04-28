import {initFlowbite} from 'flowbite'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        initFlowbite()
    })

    // re-initialize Flowbite *after* each page navigation
    nuxtApp.hook('page:finish', () => {
        initFlowbite()
    })
})