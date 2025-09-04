import {createVNode, render, type DefineComponent} from 'vue'

export async function showToast(type: 'success' | 'danger' | 'warning', message: string) {
    const container = document.createElement('div')
    const toaster = document.querySelector('#toaster')
    toaster?.appendChild(container)

    let Toast: DefineComponent<any, any, any>
    switch (type) {
        case "success":
            // @ts-ignore
            Toast = (await import('~/components/Toast/ToastSuccess.vue')).default
            break;
        case "danger":
            // @ts-ignore
            Toast = (await import('~/components/Toast/ToastDanger.vue')).default
            break;
        case "warning":
            // @ts-ignore
            Toast = (await import('~/components/Toast/ToastWarning.vue')).default
            break;
    }
    // Create a VNode for ToastSuccess with the provided props
    const vnode = createVNode(Toast, {message})

    // Render the VNode into the container
    render(vnode, container)

    // Optionally unmount after the timeout + transition duration
    setTimeout(() => {
        render(null, container)
        toaster?.removeChild(container)
    },3000)
}
