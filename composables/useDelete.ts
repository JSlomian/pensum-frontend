export const useDelete = (route: string) => {
    const {$authFetch} = useAuth()
    if (!route.endsWith('/')) {
        route = route + '/'
    }
    const callDelete = async (id: number) => {
        return await $authFetch(`${route}${id}`, {
            method: 'DELETE'
        })
    }
    return {callDelete}
}