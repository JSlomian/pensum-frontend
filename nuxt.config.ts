// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@sidebase/nuxt-auth',
        '@pinia/nuxt',
        // '@nuxtjs/i18n',
        // './modules/flowbite'
    ],
    imports: {
        dirs: [
            'types/*.d.ts'
        ]
    },
    tailwindcss: {
        cssPath: '~/assets/css/input.css'
    },
    runtimeConfig: {
        api_url: 'http://localhost:8000'
    },
    auth: {
        globalAppMiddleware: false,
        isEnabled: true,
        disableServerSideAuth: false,
        // secret: "68767b88d5e3df412d72f2376044f02b6fb91028c264b53e12ba816a20fbcd1c",
        baseURL: 'http://localhost:8000/login_check',
        provider: {
            type: 'local',
            token: {
                signInResponseTokenPointer: '/token',
                type: 'Bearer',
                // cookieName: 'token',
                // headerName: 'Authorization',
                // maxAgeInSeconds: 1800,
                // sameSiteAttribute: 'lax',
                // cookieDomain: 'localhost',
                // secureCookieAttribute: false,
                // httpOnlyCookieAttribute: false,
            }
        },
        // sessionRefresh: {
        //     enablePeriodically: true,
        //     enableOnWindowFocus: true,
        // },
    },
    plugins: [
        {
            src: 'plugins/flowbite.client.js', mode: 'client'
        }],
    // i18n: {
    //     locales: ['pl', 'en'],
    //     defaultLocale: 'en',
    //     strategy: 'no_prefix',
    //     customRoutes: 'config',
    //     detectBrowserLanguage: false,
    //     pages: {
    //         institutes: {
    //             pl: '/jednostki--organizacyjne',
    //             en: '/institutes'
    //         }
    //     }
    // },
})
