export const usePost = (route: string) => {
    route = route.split('?')[0]
    if (route.endsWith('/')) {
        route = route.slice(0, -1)
    }
    const callPost = async ({...rest}: { [key: string]: any }) => {
        return await useFetch(`${route}`, {
                method: 'POST',
                body: rest,
                credentials: "include"
            },
        )
    }
    return {callPost}
}