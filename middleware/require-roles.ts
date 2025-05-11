// middleware/require-roles.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

/**
 * Expects `to.meta.requiresRoles` to be an array of strings.
 * Will run on both server and client before page load.
 */
export default defineNuxtRouteMiddleware((to) => {
  // @ts-ignore
  const required: string[] = to.meta.requiresRoles || []
  // `useAuth()` should work in SSR if your auth module supports it
  const { data: user, status } = useAuth()

  // 1. If not authenticated → send to login:
  if (status.value !== 'authenticated') {
    return navigateTo('/login')
  }

  // 2. If authenticated but missing all required roles → home:
  const roles = user.value?.roles || []
  const hasRole = required.some(r => roles.includes(r))
  if (required.length > 0 && !hasRole) {
    return navigateTo('/')
  }

  // else: allow navigation
})
