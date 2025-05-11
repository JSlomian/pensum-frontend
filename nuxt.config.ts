// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@sidebase/nuxt-auth',
        '@pinia/nuxt',
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
        api_url: 'https://localhost:8000'
    },
    auth: {
        globalAppMiddleware: true,
        isEnabled: true,
        baseURL: 'https://localhost:8000',
        originEnvKey: 'NUXT_PUBLIC_API_URL',
        provider: {
            type: 'local',
            endpoints: {
                signIn: {path: '/login_check', method: 'post'},
                signOut: false,
                signUp: false,
                getSession: {path: '/profile', method: 'get'}
            },
            token: {
                signInResponseTokenPointer: '/token',
                type: 'Bearer',
                headerName: 'Authorization',
                maxAgeInSeconds: 3600,
                cookieName: 'auth.token',
                sameSiteAttribute: 'lax',     // allow cookie on same-site navigations & top-level POSTs :contentReference[oaicite:0]{index=0}
                cookieDomain: 'localhost',
                secureCookieAttribute: false,     // in dev over HTTP
                httpOnlyCookieAttribute: false,
            },
            refresh: {
                isEnabled: true,
                endpoint: {path: '/token/refresh', method: 'post'},
                token: {
                    signInResponseRefreshTokenPointer: '/refresh_token',
                    refreshRequestTokenPointer: '/refresh_token',
                    cookieName: 'auth.refresh',
                    maxAgeInSeconds: 3600,
                    sameSiteAttribute: 'lax',
                    secureCookieAttribute: false,
                    httpOnlyCookieAttribute: false,
                },
                refreshOnlyToken: true,
            },
            session: {
                dataType: {
                    id: 'number',
                    username: 'string',
                    email: 'string',
                    roles: 'array'
                },
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
