export const useDelete = (route: string) => {
    route = route.split('?')[0]
    if (!route.endsWith('/')) {
        route = route + '/'
    }
    const callDelete = async (id: number) => {
        return await useFetch(`${route}${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
    }
    return {callDelete}
}