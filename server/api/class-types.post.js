export default defineEventHandler(async (event) => {
    const { api_url } = useRuntimeConfig()
    console.log(event.headers)
    const dd = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json'
        },
        body: await readBody(event)
    }
    console.log(dd)
    const { data, error } = await $fetch(`${api_url}/api/class_types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(await readBody(event))
    })
    console.log(error)
});
