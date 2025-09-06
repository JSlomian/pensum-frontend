import type { UseFetchOptions } from '#app'

export const useDelete = (route: string) => {
  route = route.split('?')[0]
  if (!route.endsWith('/')) {
    route = route + '/'
  }
  const callDelete = async (id: number, opts?: UseFetchOptions) => {
    return await useFetch(`${route}${id}`, {
      method: 'DELETE',
      credentials: 'include',
      ...opts,
    })
  }
  return { callDelete }
}
