export default defineEventHandler(async (event) => {
  const {
    public: { api_url },
  } = useRuntimeConfig()
  const url = event.node.req.url || ''
  const path = url.replace(/^\/api/, '')

  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  const method = (event.node.req.method as HttpMethod) || 'GET'

  const queryParams = getQuery(event)

  let body
  if (method === 'POST' || method === 'PATCH') {
    body = await readBody(event)
  }

  const authToken = getCookie(event, 'auth.token')
  const refreshToken = getCookie(event, 'auth.refresh')
  const forbidden = ['host', 'connection', 'content-length']
  const outHeaders: Record<string, string> = {}
  for (const [key, value] of Object.entries(event.node.req.headers)) {
  if (value && !forbidden.includes(key.toLowerCase())) {
    outHeaders[key] = String(value)
  }
}
  if (authToken) {
    outHeaders.Authorization = `Bearer ${authToken}`
  }
  if (event.node.req.headers.origin) {
    outHeaders['Origin'] = event.node.req.headers.origin
  }

  try {
    return await $fetch(`${api_url}${path}`, {
      method,
      query: queryParams,
      body,
      credentials: 'include',
      headers: outHeaders,
    })
  } catch (error: any) {
    const status = error?.response?.status ?? error?.statusCode ?? 500
    setResponseStatus(event, status)
    return {
      statusCode: error?.response?.status || 500,
      message: error?.message || 'An error occurred while proxying the request',
    }
  }
})
