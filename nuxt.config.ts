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
        globalAppMiddleware: true,
        isEnabled: true,
        baseURL: '/api',
        originEnvKey: 'NUXT_PUBLIC_API_URL',
        provider: {
            type: 'local',
            endpoints: {
                signIn: {path: '/login_check', method: 'post'},
                signOut: {path: '/logout', method: 'post'},
                signUp: false,
                getSession: {path: '/api/profile', method: 'get'}
            },

            token: {
                signInResponseTokenPointer: '/token',
                maxAgeInSeconds: 3600
            },

            refresh: {
                isEnabled: false,
                // endpoint: {path: '/api/token/refresh', method: 'post'},
                // token: {
                //     signInResponseRefreshTokenPointer: '/refresh_token'
                // }
            }
        }
    },
    plugins: [
        {
            src: 'plugins/flowbite.client.js'
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
