export default defineEventHandler(async (event) => {
    const {api_url} = useRuntimeConfig()
    let url = event.node.req.url || ''
    const path = url.replace(/^\/api/, '');

    type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    const method = (event.node.req.method as HttpMethod) || 'GET';

    const queryParams = getQuery(event);

    let body;
    if (method === 'POST' || method === 'PATCH') {
        body = await readBody(event);
    }

    const token = getCookie(event, 'auth.token')
    const outHeaders: Record<string, string> = {
        ...(event.node.req.headers as Record<string, string>)
    }
    if (token) {
        outHeaders.Authorization = `Bearer ${token}`
    }

    try {
        return await $fetch(`${api_url}${path}`, {
            method,
            query: queryParams,
            body,
            headers: outHeaders
        })
    } catch (error: any) {
        console.error('Proxy error:', error);

        return {
            statusCode: error?.response?.status || 500,
            message: error?.message || 'An error occurred while proxying the request',
        };
    }
});
