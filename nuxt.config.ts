// https://nuxt.com/docs/api/configuration/nuxt-config
import {createResolver} from "@nuxt/kit";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    css: ['~/assets/css/tailwind.css'],
    modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth', '@pinia/nuxt', './modules/flowbite'],
    auth: {
        // globalAppMiddleware: true,
        provider: {
            type: 'local'
        }
    },
    runtimeConfig: {
        api_url: process.env.API_URL
    },
    plugins: [
        {
            src: 'plugins/flowbite.client.js', mode: 'client'
        }],
})