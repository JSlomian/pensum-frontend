export const useDelete = (route: string) => {
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