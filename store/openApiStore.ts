export const useOpenApiStore = defineStore('openApi', {
    state: () => ({
        docs: []
    }),
    actions: {
        setDocs(docs: any) {
            this.docs = docs
        }
    },
})