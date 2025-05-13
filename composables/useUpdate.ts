export const useUpdate = (route: string) => {
    if (!route.endsWith('/')) {
        route = route + '/'
    }
    const callUpdate = async ({id, ...rest}: { id: number; [key: string]: any }) => {
        return await useFetch(`${route}${id}`, {
            method: 'PATCH',
            headers: {
                'accept': 'application/ld+json',
                'Content-Type': 'application/merge-patch+json'
            },
            body: rest,
            credentials: 'include'
        })
    }
    return {callUpdate}
}