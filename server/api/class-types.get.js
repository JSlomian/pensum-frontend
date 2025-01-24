export default defineEventHandler(async (event) => {
    const { api_url } = useRuntimeConfig()
    // if (event)
    return await $fetch(`${api_url}/api/class_types`)
});
