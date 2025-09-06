import type { UseFetchOptions } from '#app'

export const usePost = (route: string) => {
  route = route.split('?')[0]
  if (route.endsWith('/')) {
    route = route.slice(0, -1)
  }
  const callPost = async ({ ...rest }: { [key: string]: any }, opts?: UseFetchOptions): Promise<unknown> => {
    return $fetch(
      `${route}`,
      {
        method: 'POST',
        body: rest,
        credentials: 'include',
        ...opts
      },
    )
  }
  return { callPost }
}
