export const useDelete = (route: string) => {
    if(!route.endsWith('/')) {
        route = route + '/'
    }
  const callDelete = async (id: number) =>
  {
      return await $fetch(`${route}${id}`, {
          method: 'DELETE'
      })
  }
    return {callDelete}
}