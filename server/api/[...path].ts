export default defineEventHandler(async (event) => {
    const {api_url} = useRuntimeConfig()
    const path = event.node.req.url || ''
    const method = event.node.req.method || 'GET'

    const queryParams = getQuery(event);

    let body;
    if (method === 'POST' || method === 'PATCH') {
        body = await readBody(event);
    }

    try {
        return await $fetch(`${api_url}${path}`, {
            method: method,
            query: queryParams,
            body,
            headers: event.node.req.headers as Record<string, string>
        })
    } catch (error: any) {
        console.error('Proxy error:', error);

        return {
            statusCode: error?.response?.status || 500,
            message: error?.message || 'An error occurred while proxying the request',
        };
    }
});
