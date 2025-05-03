export const usePost = (route: string) => {
    if (route.endsWith('/')) {
        route = route.slice(0, -1)
    }
    const callPost = async ({...rest}: { [key: string]: any }) => {
        return await $fetch(`${route}`, {
                method: 'POST',
                body: rest,
                throwHttpErrors: false
            },
        )
    }
    return {callPost}
}