export const usePost = (route: string) => {
    const {$authFetch} = useAuth()
    if (route.endsWith('/')) {
        route = route.slice(0, -1)
    }
    const callPost = async ({...rest}: { [key: string]: any }) => {
        return await $authFetch(`${route}`, {
                method: 'POST',
                body: rest,
                throwHttpErrors: false
            },
        )
    }
    return {callPost}
}