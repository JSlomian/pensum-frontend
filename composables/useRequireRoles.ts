export function useRequireRoles(requiredRoles: string[]) {
  const { data: user, status } = useAuth()
  const router = useRouter()

  const checkRoles = () => {
    if (status.value === 'authenticated') {
      const roles: string[] = user.value?.roles || []
      const hasOne = requiredRoles.some(r => roles.includes(r))
      if (!hasOne) {
        router.replace({ path: '/' })
      }
    }
  }

  onMounted(checkRoles)
  watch(status, () => {
    // in case status goes from 'loading' → 'authenticated'
    checkRoles()
  })
}
