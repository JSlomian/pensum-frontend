export const useUpdate = (route: string) => {
    const {$authFetch} = useAuth()
    if (!route.endsWith('/')) {
        route = route + '/'
    }
    const callUpdate = async ({id, ...rest}: { id: number; [key: string]: any }) => {
        return await $authFetch(`${route}${id}`, {
            method: 'PATCH',
            headers: {
                'accept': 'application/ld+json',
                'Content-Type': 'application/merge-patch+json'
            },
            body: rest
        })
    }
    return {callUpdate}
}